import { db } from './firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

export interface StreamItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  title: string;
  createdAt: number;
}

const CLOUD_NAME = 'oqlrhegr';
const UPLOAD_PRESET = 'vk_preset';

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const resourceType = file.type.startsWith('video/') ? 'video' : 'image';

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Upload failed');
  return data.secure_url;
};

export const getCloudStreamMedia = async (): Promise<StreamItem[]> => {
  try {
    const q = query(collection(db, 'memory_stream'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const list: StreamItem[] = [];
    
    snapshot.forEach((docSnap: QueryDocumentSnapshot<DocumentData>) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as StreamItem);
    });
    return list;
  } catch (error) {
    console.error('Error fetching stream:', error);
    return [];
  }
};

export const saveMediaToFirestore = async (url: string, type: 'photo' | 'video', title: string) => {
  const docRef = await addDoc(collection(db, 'memory_stream'), {
    type,
    url,
    title: title || 'Wedding Moment',
    createdAt: Date.now(),
  });
  return docRef.id;
};

export const deleteCloudStreamItem = async (docId: string) => {
  await deleteDoc(doc(db, 'memory_stream', docId));
};