'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  getCloudStreamMedia,
  saveMediaToFirestore,
  deleteCloudStreamItem,
  StreamItem,
} from '@/lib/cloudRepository';

interface CustomStreamItem extends StreamItem {
  category?: string;
}

// ☁️ CLOUDINARY DIRECT API CREDENTIALS
const CLOUDINARY_CLOUD_NAME = 'oqlrhegr';
const CLOUDINARY_UPLOAD_PRESET = 'vk_preset';

function StreamManagerContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') === 'memory' ? 'memory' : 'cinematic';

  const [mediaList, setMediaList] = useState<CustomStreamItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [type, setType] = useState<'photo' | 'video'>('photo');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  // 🔑 SEPARATE STORAGE KEYS FOR UPPER AND LOWER STREAMS
  const targetKey = mode === 'memory' ? 'vk_stream_photos' : 'vk_cinematic_stream';

  const loadMedia = async () => {
    try {
      // 1. First preference: Mode-specific local cache
      const rawLocal = localStorage.getItem(targetKey);
      if (rawLocal) {
        const parsed = JSON.parse(rawLocal);
        if (Array.isArray(parsed)) {
          setMediaList(parsed);
          return;
        }
      }

      // 2. Cloud Fallback with Category Filtering
      const data = await getCloudStreamMedia();
      if (data && Array.isArray(data)) {
        // Filter strictly by mode/category so memory and cinematic streams never mix
        const filteredData = data.filter((item: CustomStreamItem) => {
          if (item.category) return item.category === mode;
          return mode === 'memory' ? item.type === 'photo' : item.type === 'video';
        });

        setMediaList(filteredData);
        localStorage.setItem(targetKey, JSON.stringify(filteredData));
      }
    } catch (e) {
      console.error('Error loading media:', e);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [mode]);

  const syncToLocalAndCloud = (newItem: CustomStreamItem) => {
    const existing = JSON.parse(localStorage.getItem(targetKey) || '[]');
    const updated = [newItem, ...existing];
    localStorage.setItem(targetKey, JSON.stringify(updated));

    if (mode === 'memory') {
      localStorage.setItem('vk_gallery_photos', JSON.stringify(updated));
    } else {
      localStorage.setItem('vk_cloud_stream', JSON.stringify(updated));
    }

    setMediaList(updated);
    window.dispatchEvent(new Event('vk_stream_updated'));
  };

  // ⚡ INSTANT FAST CANVAS COMPRESSOR FOR PHOTOS
  const compressImageFast = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(file); // Return original if video
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200; // Optimal resolution for mobile & web screens

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            0.8
          );
        };
      };
      reader.readAsDataURL(file);
    });
  };

  // ☁️ FAST CLOUDINARY DIRECT UPLOAD
  const uploadDirectToCloudinary = async (file: File): Promise<string> => {
    // Compress image before uploading to Cloudinary
    const fileToUpload = await compressImageFast(file);

    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await res.json();
    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error(data.error?.message || 'Cloudinary upload failed.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Fast Compress & Upload to Cloudinary
      const uploadedUrl = await uploadDirectToCloudinary(file);
      const isVideo = file.type.startsWith('video/');
      const mediaType = isVideo ? 'video' : 'photo';
      const itemTitle = file.name.split('.')[0] || 'Gallery Upload';

      // 2. Save Link to Firestore
      let docId: any = `local_${Date.now()}`;
      try {
        docId = await saveMediaToFirestore(uploadedUrl, mediaType, itemTitle);
      } catch (fsErr) {
        console.warn('Firestore fallback active:', fsErr);
      }

      const newItem: CustomStreamItem = {
        id: typeof docId === 'string' ? docId : `local_${Date.now()}`,
        url: uploadedUrl,
        type: mediaType,
        title: itemTitle,
        category: mode, // Strictly Tag Item Category
        createdAt: Date.now(),
      };

      // 3. Sync to Storage & State
      syncToLocalAndCloud(newItem);
      alert(`✅ Uploaded to ${mode === 'memory' ? 'Memory Stream' : 'Cinematic Stream 2.0'} Successfully!`);
    } catch (err: any) {
      console.error(err);
      alert('❌ Upload Failed: ' + (err.message || 'Error occurred during Cloudinary upload'));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleAddUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = url.trim();
    if (!cleanUrl) {
      alert('⚠️ Please enter a valid URL');
      return;
    }

    setUploading(true);
    try {
      const itemTitle = title.trim() || 'Custom URL Media';
      let docId: any = `local_${Date.now()}`;
      
      try {
        docId = await saveMediaToFirestore(cleanUrl, type, itemTitle);
      } catch (fsErr) {
        console.warn('Firestore fallback:', fsErr);
      }

      const newItem: CustomStreamItem = {
        id: typeof docId === 'string' ? docId : `local_${Date.now()}`,
        url: cleanUrl,
        type: type,
        title: itemTitle,
        category: mode,
        createdAt: Date.now(),
      };

      syncToLocalAndCloud(newItem);
      setUrl('');
      setTitle('');
      alert(`✅ Direct Link Saved to ${mode === 'memory' ? 'Memory Stream' : 'Cinematic Stream 2.0'}!`);
    } catch (err: any) {
      console.error(err);
      alert('❌ Error saving link');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('🗑️ Delete this item?')) return;

    const existing = JSON.parse(localStorage.getItem(targetKey) || '[]');
    const updated = existing.filter((item: any) => item.id !== id);
    localStorage.setItem(targetKey, JSON.stringify(updated));

    if (mode === 'memory') {
      localStorage.setItem('vk_gallery_photos', JSON.stringify(updated));
    } else {
      localStorage.setItem('vk_cloud_stream', JSON.stringify(updated));
    }

    setMediaList(updated);
    window.dispatchEvent(new Event('vk_stream_updated'));

    try {
      await deleteCloudStreamItem(id);
    } catch (e) {
      console.warn('Cloud delete fallback:', e);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-3 sm:p-6 max-w-6xl mx-auto space-y-5 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-800 pb-4 gap-3">
        <div>
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest font-mono block">
            {mode === 'memory' ? '🖼️ UPPER MARQUEE STREAM' : '🎬 LOWER 3D DECK SHOWCASE'}
          </span>
          <h1 className="text-xl sm:text-3xl font-black text-white mt-0.5">
            {mode === 'memory' ? 'Edit Memory Stream Manager' : 'Cinematic Stream 2.0 Manager'}
          </h1>
        </div>
        <Link 
          href="/admin?settings=open"
          className="self-start sm:self-auto bg-stone-900 border border-stone-800 hover:border-amber-500/50 text-stone-300 hover:text-amber-400 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 font-mono"
        >
          🌐Back to settings 
        </Link>
      </div>

      {uploading && (
        <div className="bg-amber-500/10 border border-amber-500/40 text-amber-400 p-3.5 rounded-xl text-center font-mono text-xs animate-pulse">
          ⚡ Fast Compressing & Uploading to Cloudinary... Please wait...
        </div>
      )}

      {/* Upload Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Gallery Upload Box */}
        <div className="bg-stone-900/90 border border-stone-800 p-5 rounded-2xl text-center space-y-3 shadow-xl">
          <span className="text-amber-400 font-mono text-xs font-bold uppercase block">
            📱 UPLOAD FROM GALLERY (FAST COMPRESSION)
          </span>
          <p className="text-[11px] text-stone-400">Select photos/reels directly from your phone or device storage.</p>
          
          <label className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-3.5 px-6 rounded-xl text-xs uppercase cursor-pointer inline-flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 active:scale-95 transition">
            <span>📂 Select File From Gallery</span>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {/* Direct URL Box */}
        <div className="bg-stone-900/90 border border-stone-800 p-5 rounded-2xl space-y-3 shadow-xl">
          <span className="text-stone-300 font-mono text-xs font-bold uppercase block">
            🔗 ADD VIA DIRECT URL
          </span>
          <form onSubmit={handleAddUrl} className="space-y-3">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <select
                value={type}
                onChange={(e: any) => setType(e.target.value)}
                className="bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500 font-mono col-span-1"
              >
                <option value="photo">🖼️ Photo</option>
                <option value="video">🎥 Video</option>
              </select>
              
              <input
                type="text"
                required
                placeholder="Image / .mp4 URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100 font-mono focus:outline-none focus:border-amber-500 col-span-2 sm:col-span-3"
              />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Title Tag (Optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100 font-mono focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={uploading}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-4 py-2.5 rounded-xl text-xs whitespace-nowrap cursor-pointer transition shrink-0 active:scale-95"
              >
                + Add Link
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Active Media Items Grid */}
      <div className="bg-stone-900/90 border border-stone-800 p-4 sm:p-5 rounded-2xl space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-stone-800/80 pb-3">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
            {mode === 'memory' ? '📸 MEMORY STREAM ACTIVE MEDIA' : '🎬 CINEMATIC 2.0 ACTIVE MEDIA'} ({mediaList.length})
          </span>
        </div>

        {mediaList.length === 0 ? (
          <p className="text-xs text-stone-500 py-10 text-center italic font-mono">
            No active media in this stream. Upload a photo/video or add a link above!
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {mediaList.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-stone-950 border border-stone-800 rounded-2xl overflow-hidden relative group shadow-lg flex flex-col justify-between"
              >
                <div className="aspect-3/4 w-full overflow-hidden bg-stone-900 relative">
                  {item.type === 'photo' || (!item.type && !item.url?.endsWith('.mp4')) ? (
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <video src={item.url} className="w-full h-full object-cover" muted loop autoPlay />
                  )}
                  
                  <button
                    onClick={() => handleDelete(item.id)}
                    type="button"
                    className="absolute top-2 right-2 bg-rose-500/90 hover:bg-rose-600 text-white p-1.5 rounded-xl text-xs cursor-pointer shadow-md backdrop-blur-xs transition"
                    title="Delete Media"
                  >
                    🗑️
                  </button>
                </div>

                <div className="p-2.5 border-t border-stone-800/80 bg-stone-950 flex justify-between items-center text-[10px] font-mono text-stone-300">
                  <span className="truncate font-bold">{item.title || 'Untitled'}</span>
                  <span className="text-amber-400 uppercase font-black text-[9px] shrink-0 ml-1">
                    {item.type || 'photo'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default function AdminNewStreamPage() {
  return (
    <Suspense fallback={<div className="p-8 text-amber-400 font-mono text-xs">Loading Stream Manager...</div>}>
      <StreamManagerContent />
    </Suspense>
  );
}