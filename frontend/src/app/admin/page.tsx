'use client';


import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  onAuthStateChanged, 
  signOut,
  User 
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  setDoc, 
  getDoc, 
  deleteDoc, 
  arrayUnion 
} from 'firebase/firestore';

const ALLOWED_ADMINS = [
  'ashutosh9644213129@gmail.com',
  'omprakashvishwakarma205@gmail.com',
  'mr.abhishek.472@gmail.com',
];

const MASTER_BOSS_EMAIL = 'mr.abhishek.472@gmail.com';

function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams(); // 👈 1. Added Search Params

  // ⚙️ 2. URL Se ?settings=open Detect Karke Modal Auto-Open Karega
  useEffect(() => {
    if (searchParams?.get('settings') === 'open') {
      setCurrentModalView('grid');
      setShowSettingsModal(true);
    }
  }, [searchParams]);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [authProcessing, setAuthProcessing] = useState(false);

  // Dashboard Data States
  const [bookingsList, setBookingsList] = useState<any[]>([]);
  const [historyList, setHistoryList] = useState<any[]>([]);

  // 🔔 REALTIME NOTIFICATION TOAST & REFS
  const [liveToast, setLiveToast] = useState<{ message: string; bookingNo: string } | null>(null);
  const previousBookingsRef = useRef<any[]>([]);
  const sealFileInputRef = useRef<HTMLInputElement | null>(null);
  const btsFileInputRef = useRef<HTMLInputElement | null>(null);

  // ⚙️ SETTINGS MODAL VIEW STATE
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [currentModalView, setCurrentModalView] = useState<'grid' | 'history' | 'bts'>('grid');

  // 🎬 BTS STREAM MANAGEMENT STATES
  const [btsList, setBtsList] = useState<any[]>([]);
  const [newBtsUrl, setNewBtsUrl] = useState('');
  const [newBtsTitle, setNewBtsTitle] = useState('');

  // Search & Sorting States
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'amount_high' | 'amount_low'>('latest');
  

  // Load BTS Stream Items From Cloud Firestore First
  const loadBtsStreamData = async () => {
    try {
      const docRef = doc(db, 'settings', 'bts_stream');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const list = docSnap.data().list;
        if (Array.isArray(list)) {
          setBtsList(list);
          localStorage.setItem('vk_bts_stream', JSON.stringify(list));
          return;
        }
      }
    } catch (e) {
      console.error('Firestore BTS Load Error:', e);
    }
    try {
      const saved = localStorage.getItem('vk_bts_stream') || localStorage.getItem('vk_behind_the_lens');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setBtsList(parsed);
          return;
        }
      }
      setBtsList([]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadBtsStreamData();
  }, []);

  // BTS Add Handler (Cloud Sync)
  const handleAddBtsItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBtsUrl.trim()) {
      alert('⚠️ Kripya Image/Media URL dalein.');
      return;
    }

    const newItem = {
      id: `bts_${Date.now()}`,
      url: newBtsUrl.trim(),
      title: newBtsTitle.trim() || 'Behind The Lens',
      createdAt: new Date().toISOString(),
    };

    const updated = [newItem, ...btsList];
    setBtsList(updated);
    localStorage.setItem('vk_bts_stream', JSON.stringify(updated));

    try {
      await setDoc(doc(db, 'settings', 'bts_stream'), { list: updated, updatedAt: new Date().toISOString() });
      window.dispatchEvent(new Event('vk_bts_updated'));
      setNewBtsUrl('');
      setNewBtsTitle('');
      alert('🎉 BTS Media Successfully Added & Synced to Cloud!');
    } catch (err) {
      alert('⚠️ Cloud Save Error! Check Connection.');
    }
  };

  // 🗑️ BTS ITEM DELETE HANDLER (Cloud Sync)
  const handleDeleteBtsItem = async (id: string) => {
    if (!window.confirm('Delete this BTS item?')) return;
    const updated = btsList.filter((item) => item.id !== id);
    setBtsList(updated);
    localStorage.setItem('vk_bts_stream', JSON.stringify(updated));

    try {
      await setDoc(doc(db, 'settings', 'bts_stream'), { list: updated, updatedAt: new Date().toISOString() });
      window.dispatchEvent(new Event('vk_bts_updated'));
      alert('🗑️ BTS Item Deleted From Cloud!');
    } catch (err) {
      alert('⚠️ Cloud Update Failed.');
    }
  };

  // 📸 OPTIMIZED BTS GALLERY FILE UPLOAD HANDLER
  const handleBtsFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert('⚠️ File size 20MB se kam rakhein.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = async () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1000;

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

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

        const newItem = {
          id: `bts_${Date.now()}`,
          url: compressedBase64,
          title: file.name.split('.')[0] || 'Studio BTS',
          createdAt: new Date().toISOString(),
        };

        try {
          const updated = [newItem, ...btsList];
          setBtsList(updated);
          localStorage.setItem('vk_bts_stream', JSON.stringify(updated));

          await setDoc(doc(db, 'settings', 'bts_stream'), { list: updated, updatedAt: new Date().toISOString() });
          window.dispatchEvent(new Event('vk_bts_updated'));
          alert('🎉 Gallery Se BTS Media Successfully Upload & Synced to Cloud!');
        } catch (storageErr) {
          alert('⚠️ Upload Failed! Cloud Sync Check Karein.');
        }
      };
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // 📁 Gallery Se Seal Upload Handler
  const handleSealFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('⚠️ Image size 3MB se choti rakhein.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      localStorage.setItem('vk_studio_seal_url', base64Image);
      try {
        await setDoc(doc(db, 'settings', 'studio_seal'), { url: base64Image, updatedAt: new Date().toISOString() });
        alert('🎉 Phone Gallery Se Studio Seal Successfully Upload & Synced to Cloud!');
      } catch (e) {
        alert('🎉 Local Save Successful!');
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerSealGalleryUpload = () => {
    if (sealFileInputRef.current) {
      sealFileInputRef.current.click();
    }
  };

  // 🔔 TRIGGER SOUND & VIBRATION ALERT
  const triggerNewRequestAlert = (msg: string, bookingNo: string) => {
    setLiveToast({ message: msg, bookingNo });

    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 300]);
    }

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      console.warn('Audio play restricted by browser:', e);
    }

    setTimeout(() => {
      setLiveToast(null);
    }, 8000);
  };

  // 1️⃣ Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && ALLOWED_ADMINS.map(e => e.toLowerCase()).includes(currentUser.email?.toLowerCase() || '')) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2️⃣ Realtime Firestore Sync Engine
  useEffect(() => {
    if (!user) return;

    let unsubBookings: (() => void) | null = null;
    let unsubHistory: (() => void) | null = null;

    try {
      unsubBookings = onSnapshot(
        collection(db, 'bookings'),
        (snapshot) => {
          const fetched: any[] = [];
          snapshot.forEach((docSnap) => {
            fetched.push({
              id: docSnap.id,
              ...docSnap.data(),
            });
          });

          setBookingsList(fetched);
          localStorage.setItem('vk_creation_bookings', JSON.stringify(fetched));

          fetched.forEach((newItem) => {
            const oldItem = previousBookingsRef.current.find(b => b.bookingNumber === newItem.bookingNumber);
            if (newItem.paymentSubmitted && (!oldItem || !oldItem.paymentSubmitted)) {
              triggerNewRequestAlert(
                `🎉 New Payment Received from ${newItem.clientName || 'Client'} (₹${(newItem.lastSubmittedAmount || newItem.advanceRequired || 0).toLocaleString('en-IN')})!`,
                newItem.bookingNumber
              );
            }
          });

          previousBookingsRef.current = fetched;
        },
        (err) => {
          console.warn('Realtime Cloud Sync Notice:', err);
        }
      );

      unsubHistory = onSnapshot(
        collection(db, 'history_bookings'),
        (snapshot) => {
          const fetchedHist: any[] = [];
          snapshot.forEach((docSnap) => {
            fetchedHist.push({
              id: docSnap.id,
              ...docSnap.data(),
            });
          });
          setHistoryList(fetchedHist);
          localStorage.setItem('vk_creation_history_bookings', JSON.stringify(fetchedHist));
        },
        (err) => {
          console.warn('History Cloud Sync Notice:', err);
        }
      );

    } catch (err) {
      console.error('Realtime Firestore Listen Error:', err);
    }

    return () => {
      if (unsubBookings) unsubBookings();
      if (unsubHistory) unsubHistory();
    };
  }, [user]);

  // Auth Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const inputEmail = email.trim().toLowerCase();

    if (!ALLOWED_ADMINS.map(e => e.toLowerCase()).includes(inputEmail)) {
      setError('❌ Access Denied! This Email ID is not authorized.');
      return;
    }

    setAuthProcessing(true);
    try {
      await signInWithEmailAndPassword(auth, inputEmail, password);
    } catch (err: any) {
      setError('❌ Invalid Email or Password. Please try again.');
    } finally {
      setAuthProcessing(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setResetSent(true);

    try {
      await sendPasswordResetEmail(auth, MASTER_BOSS_EMAIL);
    } catch (err: any) {
      console.error('Reset Link Error:', err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // 💳 PAYMENT & UPI QR CONTROL HANDLER
  const handleUpdatePaymentInfo = () => {
    const currentUpi = localStorage.getItem('vk_studio_upi') || '9753820740@upi';
    const currentHolder = localStorage.getItem('vk_studio_payee_name') || 'VK Creation Studio';

    const newUpi = prompt('💳 ENTER NEW UPI ID FOR PAYMENTS & QR:\n\nExample: 9753820740@ybl, vkcreation@upi', currentUpi);
    if (!newUpi || !newUpi.trim()) return;

    const newHolder = prompt('👤 ENTER ACCOUNT / PAYEE NAME:\n\nExample: VK Creation Studio, Omprakash Vishwakarma', currentHolder);

    localStorage.setItem('vk_studio_upi', newUpi.trim());
    localStorage.setItem('vk_studio_payee_name', (newHolder || 'VK Creation Studio').trim());

    alert(`✅ PAYMENT & QR INFO UPDATED SUCCESSFULLY!\n\nUPI ID: ${newUpi.trim()}\nPayee Name: ${newHolder || 'VK Creation Studio'}`);
  };

  // 📲 WHATSAPP DIRECT SHARE HANDLER
  const sendWhatsAppPortalLink = (item: any) => {
    const phone = (item.clientPhone || item.customerPhone || '').replace(/\D/g, '');
    if (!phone) {
      alert('⚠️ Client Mobile Number nahi mila.');
      return;
    }
    const portalUrl = `${window.location.origin}/portal/${item.bookingNumber}`;
    const message = `Namaste ${item.clientName || 'Client'} Ji! 🙏\nVK_Creation Studio Client VIP Portal Link:\n${portalUrl}\n\nAap yahan se apke booking contract, payment receipts aur advance installments dekhein aur pay karein. Thank you!✨`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Financial Calculations
  const totalCollected = bookingsList.reduce((sum, b) => sum + (Number(b.advancePaid) || 0), 0);
  const totalReceivables = bookingsList.reduce(
    (sum, b) => sum + (Number(b.remainingBalance ?? (Number(b.totalAmount) - Number(b.advancePaid || 0))) || 0),
    0
  );

  // ⏳ SET TOKEN DIRECT TO FIRESTORE CLOUD
  const handleCreateCustomToken = async (item: any) => {
    const total = Number(item.totalAmount) || 40000;
    const paid = Number(item.advancePaid) || 0;
    const remaining = Math.max(0, total - paid);

    if (remaining <= 0) {
      alert('✅ Booking is already 100% fully paid!');
      return;
    }

    const input = prompt(
      `💰 SET NEXT INSTALLMENT TOKEN (₹)\n\nTotal Contract: ₹${total.toLocaleString('en-IN')}\nAlready Paid: ₹${paid.toLocaleString('en-IN')}\nRemaining Due: ₹${remaining.toLocaleString('en-IN')}\n\nEnter amount:`,
      ''
    );
    if (!input) return;

    const tokenAmount = Number(input);

    if (isNaN(tokenAmount) || tokenAmount <= 0 || tokenAmount > remaining) {
      alert('⚠️ Kripya sahi amount enter karein.');
      return;
    }

    try {
      const newStatus = `Awaiting Token (₹${tokenAmount.toLocaleString('en-IN')})`;

      const bookingRef = doc(db, 'bookings', item.bookingNumber);
      await updateDoc(bookingRef, {
        advanceRequired: tokenAmount,
        paymentSubmitted: false,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });

      alert(`✅ Next Token set to ₹${tokenAmount.toLocaleString('en-IN')} successfully! Realtime sync active.`);
    } catch (e) {
      console.error(e);
      alert('Failed to update token on Cloud.');
    }
  };

  const handleConfirmTokenPayment = async (item: any) => {
    const amountSubmitted = Number(item.lastSubmittedAmount) || Number(item.advanceRequired) || 5000;
    
    if (!window.confirm(`⚠️ CONFIRM RECEIVED PAYMENT:\n\nRef: [${item.bookingNumber}]\nReceived Amount: ₹${amountSubmitted.toLocaleString('en-IN')}`)) return;

    try {
      const total = Number(item.totalAmount) || 40000;
      const prevPaid = Number(item.advancePaid) || 0;
      const newPaid = prevPaid + amountSubmitted;
      const newRemaining = Math.max(0, total - newPaid);
      const isCleared = newRemaining <= 0;

      const newInstallment = {
        installment: `Installment #${(item.installmentsHistory?.length || 0) + 1}`,
        description: isCleared ? 'Final Balance Settlement' : 'Advance Installment Amount',
        amount: amountSubmitted,
        date: new Date().toLocaleDateString('en-IN'),
        utr: item.utrNumber || 'UPI/Verified',
      };

      const bookingRef = doc(db, 'bookings', item.bookingNumber);
      await updateDoc(bookingRef, {
        advancePaid: newPaid,
        remainingBalance: newRemaining,
        advanceRequired: 0,
        paymentSubmitted: false,
        status: isCleared ? 'Confirmed & Fully Cleared' : `Active (₹${newPaid.toLocaleString('en-IN')} Paid)`,
        installmentsHistory: arrayUnion(newInstallment),
        updatedAt: new Date().toISOString(),
      });

      alert(`🎉 Payment Approved! Live on Client Device.`);
    } catch (e) {
      console.error(e);
      alert('Failed to confirm payment on Cloud.');
    }
  };

  const handleRejectTokenPayment = async (item: any) => {
    if (!window.confirm(`⚠️ REJECT PAYMENT REQUEST?`)) return;

    try {
      const bookingRef = doc(db, 'bookings', item.bookingNumber);
      await updateDoc(bookingRef, {
        paymentSubmitted: false,
        status: 'Payment Verification Failed',
        updatedAt: new Date().toISOString(),
      });

      alert(`❌ Payment Request Cancelled! Syncing live to client.`);
    } catch (e) {
      console.error(e);
      alert('Failed to reject payment on Cloud.');
    }
  };

  const handleResetBookingToPending = async (bookingNumber: string) => {
    if (!window.confirm(`⚠️ RE-LOCK PORTAL FOR [${bookingNumber}]?`)) return;

    try {
      const bookingRef = doc(db, 'bookings', bookingNumber);
      await updateDoc(bookingRef, {
        advancePaid: 0,
        remainingBalance: 40000,
        advanceRequired: 5000,
        paymentSubmitted: false,
        status: 'Awaiting Client Payment',
        installmentsHistory: [],
        updatedAt: new Date().toISOString(),
      });

      alert(`🔒 Portal RE-LOCKED on Cloud!`);
    } catch (e) {
      console.error(e);
      alert('Failed to re-lock portal on Cloud.');
    }
  };
  
  const handleArchiveBooking = async (bookingNumber: string) => {
    if (!window.confirm(`📦 Move Booking ${bookingNumber} to History?`)) return;

    try {
      const targetItem = bookingsList.find((b: any) => b.bookingNumber === bookingNumber);

      if (targetItem) {
        const archivedItem = { ...targetItem, archivedAt: new Date().toISOString() };

        await setDoc(doc(db, 'history_bookings', bookingNumber), archivedItem);
        await deleteDoc(doc(db, 'bookings', bookingNumber));

        alert('✅ Booking Moved to Cloud History!');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to archive booking on Cloud.');
    }
  };

  const handlePermanentDelete = async (bookingNumber: string) => {
    if (!window.confirm(`🔥 Permanently Delete ${bookingNumber}?`)) return;

    try {
      await deleteDoc(doc(db, 'history_bookings', bookingNumber));
      alert('🔥 Permanently Deleted from Cloud!');
    } catch (e) {
      console.error(e);
      alert('Failed to delete permanently on Cloud.');
    }
  };

  const handleRestoreFromHistory = async (bookingNumber: string) => {
    try {
      const targetItem = historyList.find((b: any) => b.bookingNumber === bookingNumber);

      if (targetItem) {
        await setDoc(doc(db, 'bookings', bookingNumber), targetItem);
        await deleteDoc(doc(db, 'history_bookings', bookingNumber));

        alert('⚡ Booking Restored to Active List!');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to restore booking on Cloud.');
    }
  };

const pendingApprovalsCount = bookingsList.filter((b) => b.paymentSubmitted === true).length;

  const filteredAndSortedList = bookingsList
    .filter((b) => {
      const q = searchQuery.toLowerCase();
      const clientName = (b.clientName || b.customerName || '').toLowerCase();
      const bookingNumber = (b.bookingNumber || '').toLowerCase();
      const clientPhone = (b.clientPhone || b.customerPhone || '').toLowerCase();
      return clientName.includes(q) || bookingNumber.includes(q) || clientPhone.includes(q);
    })
    .sort((a, b) => {
      // 🚨 PRIORITY 1: New Payment Submitted Requests ALWAYS on Top
      if (a.paymentSubmitted && !b.paymentSubmitted) return -1;
      if (!a.paymentSubmitted && b.paymentSubmitted) return 1;

      // PRIORITY 2: Dropdown Sorting Choice
      if (sortBy === 'amount_high') return (b.totalAmount || 0) - (a.totalAmount || 0);
      if (sortBy === 'amount_low') return (a.totalAmount || 0) - (b.totalAmount || 0);
      if (sortBy === 'oldest') return new Date(a.eventDate || 0).getTime() - new Date(b.eventDate || 0).getTime();
      
      // Default: Latest Created / Updated First
      const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      if (timeA !== timeB) return timeB - timeA;

      return (b.bookingNumber || '').localeCompare(a.bookingNumber || '');
    });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-stone-950 text-amber-400 flex items-center justify-center font-mono text-xs">
        ⏳ Verifying Admin Credentials with Cloud Guard...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4 font-sans relative">
        <div className="bg-stone-900 border-2 border-amber-500/50 w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative text-center">
          
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-400 to-amber-600 mx-auto flex items-center justify-center text-stone-950 text-2xl font-black shadow-lg shadow-amber-500/20">
              👑
            </div>
            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 inline-block">
              VK_CREATION MANAGEMENT
            </span>
            <h2 className="text-2xl font-black text-stone-100 pt-1">
              {resetSent ? 'Password Reset Sent' : 'Admin Portal Login'}
            </h2>
            <p className="text-xs text-stone-400">
              {resetSent ? 'Check your founder email inbox' : 'Authorized Owners & Creative Leadership Only'}
            </p>
          </div>

          {resetSent ? (
            <div className="space-y-5">
              <div className="bg-emerald-500/10 border border-emerald-500/40 p-5 rounded-2xl text-left space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <span className="text-lg">📩</span> Link Sent Successfully!
                </div>
                <p className="text-xs text-stone-300 leading-relaxed font-sans">
                  Password reset link explicitly Founder Email ID par send kar diya gaya hai:
                </p>
                <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-center font-mono text-xs text-emerald-400 font-bold break-all">
                  {MASTER_BOSS_EMAIL}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setResetSent(false)}
                className="w-full bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition border border-stone-700 cursor-pointer font-mono"
              >
                ← Back to Login Form
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/40 text-rose-400 p-3 rounded-xl text-xs font-mono">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-mono text-stone-300 mb-1">
                    Admin Email ID:
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="vkcreationstudio@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3.5 text-amber-400 font-mono text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-stone-300 mb-1">
                    Password:
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3.5 text-amber-400 font-mono text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authProcessing}
                  className="w-full bg-linear-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-stone-950 font-black py-4 rounded-2xl text-xs uppercase tracking-wider transition shadow-xl shadow-amber-500/20 active:scale-95 cursor-pointer font-mono"
                >
                  {authProcessing ? '🔓 Authenticating...' : '🔐 SECURE ADMIN LOGIN →'}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-stone-400 hover:text-amber-400 transition font-mono underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans relative">
      
      {/* 🔔 LIVE SOUND & VIBRATION TOAST ALERT */}
      {liveToast && (
        <div className="fixed top-5 right-5 z-50 bg-stone-900 border-2 border-amber-500 text-amber-300 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce font-mono text-xs max-w-md">
          <span className="text-xl shrink-0">🔔</span>
          <div>
            <strong className="block text-amber-400 font-bold">New Notification!</strong>
            <p className="text-stone-200">{liveToast.message}</p>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-800 pb-5 gap-4">
        <div>
          <span className="text-[10px] sm:text-xs font-bold text-amber-500 uppercase tracking-widest font-mono">
            EXECUTIVE CONTROL CENTER (FIREBASE SHIELD ACTIVE)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100 mt-1">
            VK_Studio
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Logged in Admin: <strong className="text-amber-400 font-mono">{user.email}</strong>
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
          <button
            onClick={() => {
              setCurrentModalView('grid');
              setShowSettingsModal(true);
            }}
            className="flex-1 sm:flex-none text-center rounded-xl bg-stone-900 border border-amber-500/40 hover:bg-stone-800 hover:border-amber-400 px-4 py-2.5 text-xs font-bold text-amber-400 transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer font-mono"
          >
            <span>⚙️</span> Studio Settings
          </button>

          <Link
            href="/builder"
            className="flex-1 sm:flex-none text-center rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2.5 text-xs font-bold text-stone-950 transition shadow-lg shadow-amber-500/10"
          >
            + Create Proposal
          </Link>
          <Link
            href="/"
            className="flex-1 sm:flex-none text-center rounded-xl border border-stone-800 bg-stone-950 hover:border-stone-700 px-3 py-2.5 text-xs font-semibold text-stone-400 transition"
          >
            Main Site →
          </Link>
          <button
            onClick={handleLogout}
            className="flex-1 sm:flex-none text-center rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 px-3 py-2.5 text-xs font-mono font-bold transition cursor-pointer"
          >
            🔒 Logout
          </button>
        </div>
      </div>

      {/* Dynamic Financial KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-4 sm:p-5 space-y-1">
          <span className="text-[10px] sm:text-xs font-bold text-stone-400 uppercase tracking-wider block">Realized Revenue</span>
          <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            ₹{totalCollected.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-stone-500">Collected via Token Payments</p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-4 sm:p-5 space-y-1">
          <span className="text-[10px] sm:text-xs font-bold text-stone-400 uppercase tracking-wider block">Pending Receivables</span>
          <p className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
            ₹{totalReceivables.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-stone-500">Unsettled contract balances</p>
        </div>
      </div>

      {/* CLIENT INQUIRIES & APPROVAL HUB */}
      <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-4 sm:p-6 space-y-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-800 pb-4 gap-3">
<div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-amber-500 uppercase tracking-wider flex items-center gap-2">
                📥 CLIENT INQUIRIES & APPROVAL HUB
              </h2>
              {pendingApprovalsCount > 0 && (
                <span className="bg-amber-400 text-stone-950 font-mono font-black text-[10px] px-2.5 py-0.5 rounded-full animate-bounce shadow-lg shadow-amber-500/40 border border-amber-300">
                  ⚡ {pendingApprovalsCount} PAYMENT NEED APPROVAL
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-400">
              Manage client proposals, confirm installment QR payments, and unlock portals.
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <input
              type="text"
              placeholder="🔍 Search by Client Name, Phone, or Ref ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-amber-400 placeholder-stone-500 focus:outline-none focus:border-amber-500 font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-stone-500 hover:text-stone-200"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-stone-400 font-mono whitespace-nowrap">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-stone-300 font-mono focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="latest">✨ Latest Inquiries First</option>
              <option value="oldest">📅 Event Date (Oldest First)</option>
              <option value="amount_high">💰 Valuation (High → Low)</option>
              <option value="amount_low">💵 Valuation (Low → High)</option>
            </select>
          </div>
        </div>

        {/* Inquiries Content */}
        {filteredAndSortedList.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-stone-800 rounded-xl bg-stone-950/40 space-y-2">
            <p className="text-xs text-stone-400 italic">
              {searchQuery
                ? `No matching inquiries found for "${searchQuery}".`
                : 'No active client inquiries found. Create a proposal from Proposal Builder!'}
            </p>
          </div>
        ) : (
          <div>
            {/* Mobile Cards View */}
            <div className="block md:hidden space-y-3.5">
              {filteredAndSortedList.map((item, idx) => {
                const total = Number(item.totalAmount) || 40000;
                const paid = Number(item.advancePaid) || 0;
                const remaining = Math.max(0, total - paid);
                const isFullyCleared = remaining <= 0;
                const isClientSubmittedPayment = item.paymentSubmitted === true;
                const hasPendingToken = Number(item.advanceRequired) > 0 && !isClientSubmittedPayment && !isFullyCleared;

          return (
                      <div
                        key={item.bookingNumber || idx}
                        className={`bg-stone-950 p-4 rounded-2xl space-y-3 shadow-xl transition-all duration-500 relative overflow-hidden ${
                          isClientSubmittedPayment
                            ? 'border-2 border-amber-400/90 shadow-amber-500/20 bg-gradient-to-b from-amber-500/10 via-stone-950 to-stone-950'
                            : 'border border-stone-800/80'
                        }`}
                      >
                        {/* ⚡ CREATIVE ANIMATED BANNER FOR SUBMITTED PAYMENTS */}
                        {isClientSubmittedPayment && (
                          <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 font-black px-3 py-1.5 -mx-4 -mt-4 mb-2 flex items-center justify-between text-[11px] font-mono shadow-md">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-stone-950 animate-ping" />
                              <span>⚡ NEW PAYMENT SUBMITTED — AWAITING YOUR APPROVAL</span>
                            </div>
                            <span className="bg-stone-950 text-amber-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              VERIFY NOW
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between items-start border-b border-stone-800/80 pb-2.5 gap-2">
                          <div>
                            <span className="text-[9px] font-mono font-bold text-stone-500 block uppercase">REF ID</span>
                            <span className="font-mono font-black text-amber-400 text-xs">{item.bookingNumber}</span>
                          </div>

                          <div>
                            {isFullyCleared ? (
                              <span className="px-2.5 py-1 rounded-full text-[9px] font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                                ✓ 100% Paid
                              </span>
                            ) : isClientSubmittedPayment ? (
                              <span className="px-3 py-1 rounded-full text-[10px] font-black border-2 bg-amber-400 text-stone-950 border-amber-300 animate-pulse shadow-lg shadow-amber-500/30 flex items-center gap-1 font-mono">
                                <span>💰 RECEIVED:</span>
                                <span>₹{(item.lastSubmittedAmount || item.advanceRequired || 5000).toLocaleString('en-IN')}</span>
                              </span>
                            )  : hasPendingToken ? (
                          <span className="px-3 py-1 rounded-full text-[10px] font-black border-2 border-amber-400/80 bg-linear-to-r from-amber-500/20 via-amber-400/10 to-amber-500/20 text-amber-300 animate-pulse shadow-md shadow-amber-500/20 whitespace-nowrap flex items-center gap-1.5 font-mono">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                            <span className="inline-block animate-spin" style={{ animationDuration: '3s' }}>⏳</span>
                            <span>TOKEN PENDING:</span>
                            <span className="text-white font-extrabold bg-amber-500/30 px-1.5 py-0.5 rounded-md border border-amber-400/40">
                              ₹{Number(item.advanceRequired).toLocaleString('en-IN')}
                            </span>
                          </span>
                        ) :  (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold border bg-stone-800 text-stone-400 border-stone-700">
                                Awaiting Token Set
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[9px] font-bold text-stone-500 uppercase block">Client Name</span>
                            <p className="font-bold text-stone-100">{item.clientName || item.customerName || 'Valued Client'}</p>
                            <p className="text-[10px] text-stone-400 font-mono">{item.clientPhone || item.customerPhone || 'No Phone'}</p>
                          </div>

                          <div className="text-right">
                            <span className="text-[9px] font-bold text-stone-500 uppercase block">Event & Venue</span>
                            <p className="font-medium text-stone-300">{item.eventDate || 'TBD'}</p>
                            <p className="text-[10px] text-stone-500">{item.venue || item.eventLocation || 'Indore'}</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center bg-stone-900/80 p-2.5 rounded-xl border border-stone-800 text-xs">
                          <div>
                            <span className="text-[9px] font-bold text-stone-500 uppercase block">Total Valuation</span>
                            <span className="font-mono font-bold text-stone-200">₹{total.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-bold text-stone-500 uppercase block">Remaining Balance</span>
                            <span className="font-mono font-bold text-amber-400">₹{remaining.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        <div className="pt-1 flex flex-wrap gap-2 items-center justify-between">
                          <div className="flex gap-2">
                            <button
                              onClick={() => sendWhatsAppPortalLink(item)}
                              className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 font-bold px-2.5 py-1.5 rounded-xl text-[11px] transition flex items-center gap-1 cursor-pointer"
                            >
                              📲Send Portal Link
                            </button>
                            <Link
                              href={`/portal/${item.bookingNumber}`}
                              target="_blank"
                              className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold px-2.5 py-1.5 rounded-xl text-[11px] transition inline-block"
                            >
                              🔗Visit Portal
                            </Link>
                            <button
                              onClick={() => handleArchiveBooking(item.bookingNumber)}
                              className="bg-stone-900 text-stone-400 hover:text-amber-400 p-1.5 rounded-xl text-[11px] transition border border-stone-800 cursor-pointer"
                            >
                              📦 Delete
                            </button>
                          </div>

                          {!isFullyCleared ? (
                            <>
                              {isClientSubmittedPayment ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleConfirmTokenPayment(item)}
                                    className="bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition shadow-xl shadow-amber-500/30 animate-bounce cursor-pointer flex items-center gap-1"
                                  >
                                    <span>✓</span> APPROVE PAYMENT
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRejectTokenPayment(item)}
                                    className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/50 font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer"
                                  >
                                    ✕ Reject
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleCreateCustomToken(item)}
                                  className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 font-bold px-3 py-1.5 rounded-xl text-[11px] transition cursor-pointer font-mono"
                                >
                                  {hasPendingToken ? `✏️Change advance Amount: ₹${item.advanceRequired.toLocaleString('en-IN')}` : '+ Set Advance Amount'}
                                </button>
                              )}
                            </>
                          ) : (
                            <button
                              onClick={() => handleResetBookingToPending(item.bookingNumber)}
                              className="bg-stone-800 text-stone-300 border border-stone-700 px-3 py-1.5 rounded-xl text-[10px] font-bold transition cursor-pointer"
                            >
                              🔄Lock Portal 
                            </button>
                          )}
                        </div>
                      </div>
                    );
              })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs min-w-162.5">
                <thead className="bg-stone-950 text-stone-400 font-semibold border-b border-stone-800 font-mono text-[10px]">
                  <tr>
                    <th className="p-3">Ref ID</th>
                    <th className="p-3">Client Details</th>
                    <th className="p-3">Event & Venue</th>
                    <th className="p-3">Valuation</th>
                    <th className="p-3">Token & Payment Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  {filteredAndSortedList.map((item, idx) => {
                    const total = Number(item.totalAmount) || 40000;
                    const paid = Number(item.advancePaid) || 0;
                    const remaining = Math.max(0, total - paid);
                    const isFullyCleared = remaining <= 0;
                    const isClientSubmittedPayment = item.paymentSubmitted === true;
                    const hasPendingToken = Number(item.advanceRequired) > 0 && !isClientSubmittedPayment && !isFullyCleared;

                    return (
                      <tr key={idx} className="hover:bg-stone-900/40 transition">
                        <td className="p-3 font-mono font-bold text-amber-400">{item.bookingNumber}</td>
                        <td className="p-3">
                          <strong className="text-stone-200 block">{item.clientName || item.customerName || 'Valued Client'}</strong>
                          <span className="text-stone-500 text-[10px]">{item.clientPhone || item.customerPhone || 'No Phone'}</span>
                        </td>
                        <td className="p-3">
                          <span className="text-stone-300 block">{item.eventDate || 'TBD'}</span>
                          <span className="text-stone-500 text-[10px]">{item.venue || item.eventLocation || 'Indore'}</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-stone-200">
                          ₹{total.toLocaleString('en-IN')}
                        </td>
                        
                        <td className="p-3">
                            {isFullyCleared ? (
                              <span className="px-3 py-1 rounded-full text-[10px] font-black border-2 border-emerald-400/80 bg-emerald-500/20 text-emerald-300 shadow-md shadow-emerald-500/20 whitespace-nowrap flex items-center gap-1.5 font-mono">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                                <span>✓ 100% FULLY PAID (₹0 BAL)</span>
                              </span>
                            ) : isClientSubmittedPayment ? (
                              <span className="px-3 py-1 rounded-full text-[10px] font-black border-2 border-amber-300 bg-amber-400 text-stone-950 animate-bounce shadow-lg shadow-amber-500/40 whitespace-nowrap flex items-center gap-1.5 font-mono">
                                <span className="w-2 h-2 rounded-full bg-stone-950 animate-ping inline-block" />
                                <span>🔔 PAYMENT PAID: ₹{(item.lastSubmittedAmount || item.advanceRequired || 5000).toLocaleString('en-IN')}</span>
                              </span>
                            ) : hasPendingToken ? (
                                <div className="space-y-1">
                                  <span className="px-3 py-1 rounded-full text-[10px] font-black border-2 border-amber-400/80 bg-linear-to-r from-amber-500/20 via-amber-400/10 to-amber-500/20 text-amber-300 animate-pulse shadow-md shadow-amber-500/20 whitespace-nowrap inline-flex items-center gap-1.5 font-mono">
                                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block shrink-0" />
                                    <span className="inline-block animate-spin" style={{ animationDuration: '3s' }}>⏳</span>
                                    <span>TOKEN PENDING:</span>
                                    <span className="text-white font-extrabold bg-amber-500/30 px-1.5 py-0.5 rounded-md border border-amber-400/40">
                                      ₹{Number(item.advanceRequired).toLocaleString('en-IN')}
                                    </span>
                                  </span>
                                  <span className="text-[10px] text-stone-400 font-mono block pl-1">
                                    Paid So Far: <strong className="text-stone-200">₹{paid.toLocaleString('en-IN')}</strong>
                                  </span>
                                </div>
                              ) : paid > 0 ? (
                              <div className="space-y-1">
                                <span className="px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 whitespace-nowrap inline-flex items-center gap-1.5 font-mono">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                                  <span>✓ Paid: ₹{paid.toLocaleString('en-IN')}</span>
                                </span>
                                <span className="text-[10px] text-amber-400 font-mono block pl-1">
                                  Bal Due: <strong className="text-amber-300">₹{remaining.toLocaleString('en-IN')}</strong>
                                </span>
                              </div>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-[10px] font-bold border border-stone-700 bg-stone-800/80 text-stone-400 whitespace-nowrap inline-flex items-center gap-1.5 font-mono">
                                <span className="w-1.5 h-1.5 rounded-full bg-stone-500 inline-block" />
                                <span>🔍 Awaiting Token Request</span>
                              </span>
                            )}
                        </td>

                        <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => sendWhatsAppPortalLink(item)}
                            className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 font-bold px-2.5 py-1.5 rounded-lg text-[11px] transition cursor-pointer"
                            title="Send Portal Link on WhatsApp"
                          >
                            📲 WhatsApp
                          </button>

                          {!isFullyCleared ? (
                            <>
                              {isClientSubmittedPayment ? (
                                <div className="inline-flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleConfirmTokenPayment(item)}
                                    className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-3 py-1.5 rounded-lg text-[11px] transition shadow-lg shadow-amber-500/20 animate-bounce cursor-pointer"
                                  >
                                    🔔 Confirm Payment (₹{(item.lastSubmittedAmount || item.advanceRequired || 5000).toLocaleString('en-IN')})
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleRejectTokenPayment(item)}
                                    className="bg-rose-500/20 hover:bg-rose-500/40 border border-rose-500/50 text-rose-300 font-bold px-2.5 py-1.5 rounded-lg text-[11px] transition cursor-pointer"
                                    title="Reject & Reset Fake Request"
                                  >
                                    ✕ Reject
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleCreateCustomToken(item)}
                                  className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 font-bold px-2.5 py-1.5 rounded-lg text-[11px] transition cursor-pointer font-mono"
                                >
                                  {hasPendingToken ? `✏️ Token (₹${item.advanceRequired.toLocaleString('en-IN')})` : '+ Set Token'}
                                </button>
                              )}
                            </>
                          ) : (
                            <button
                              onClick={() => handleResetBookingToPending(item.bookingNumber)}
                              className="bg-stone-800 hover:bg-amber-950 text-stone-300 border border-stone-700 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer"
                            >
                            🔒Lock
                            </button>
                          )}

                          <Link
                            href={`/portal/${item.bookingNumber}`}
                            target="_blank"
                            className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold px-2.5 py-1.5 rounded-lg text-[11px] transition inline-block"
                          >
                            🔗Visit Portal
                          </Link>

                          <button
                            onClick={() => handleArchiveBooking(item.bookingNumber)}
                            className="bg-stone-900 hover:bg-amber-950 hover:text-amber-400 text-stone-400 p-1.5 rounded-lg text-[11px] transition cursor-pointer border border-stone-800"
                          >
                            📦 Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ⚙️ STUDIO SETTINGS POP-UP MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-stone-900 border border-amber-500/40 w-full max-w-4xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-5 shadow-2xl relative text-stone-100 my-auto max-h-[92vh] overflow-y-auto font-sans">
            
            <div className="flex justify-between items-center border-b border-stone-800 pb-3.5">
              <div>
                <span className="text-[9px] sm:text-[10px] font-bold text-amber-500 uppercase tracking-widest font-mono block">
                  MASTER CONTROL CENTER
                </span>
                <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                  ⚙️ Studio Configuration
                </h2>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                type="button"
                className="w-8 h-8 sm:w-10 sm:h-10 bg-stone-950 hover:bg-rose-950 text-stone-400 hover:text-rose-400 rounded-xl font-bold transition flex items-center justify-center border border-stone-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {currentModalView === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                
                {/* 💳 PAYMENT & UPI QR CONTROL TILE */}
                <button
                  type="button"
                  onClick={handleUpdatePaymentInfo}
                  className="group bg-stone-950 border border-amber-500/30 hover:border-amber-400 p-4 rounded-2xl transition-all duration-300 flex items-center gap-3.5 shadow-lg active:scale-95 text-left cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition">
                    💳
                  </div>
                  <div className="overflow-hidden">
                    <strong className="text-xs sm:text-sm font-bold text-stone-100 block group-hover:text-amber-400 transition truncate">
                      Payment & QR Control
                    </strong>
                    <span className="text-[10px] text-amber-500/80 font-mono block">
                      Update UPI & Bank Info
                    </span>
                  </div>
                </button>

                {/* 🪪 DIRECT GALLERY UPLOAD STUDIO SEAL TILE */}
                <div className="relative">
                  <input
                    type="file"
                    ref={sealFileInputRef}
                    accept="image/*"
                    onChange={handleSealFileUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={triggerSealGalleryUpload}
                    className="w-full h-full group bg-stone-950 border border-amber-500/30 hover:border-amber-400 p-4 rounded-2xl transition-all duration-300 flex items-center justify-between gap-3 shadow-lg active:scale-95 text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 overflow-hidden">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition">
                        📷
                      </div>
                      <div className="overflow-hidden">
                        <strong className="text-xs sm:text-sm font-bold text-stone-100 block group-hover:text-amber-400 transition truncate">
                          Studio Seal / Stamp
                        </strong>
                        <span className="text-[10px] text-amber-500/80 font-mono block">
                          Upload From Gallery
                        </span>
                      </div>
                    </div>

                    <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-amber-500/40 shrink-0 font-mono">
                      Choose
                    </span>
                  </button>
                </div>

                {/* Stream  1  */}
                <Link
                  href="/admin/new-stream?mode=memory"
                  onClick={() => setShowSettingsModal(false)}
                  className="group bg-stone-950 border border-stone-800 hover:border-amber-500/60 p-4 rounded-2xl transition-all duration-300 flex items-center gap-3.5 shadow-lg active:scale-95"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition">
                    🖼️
                  </div>
                  <div className="overflow-hidden">
                    <strong className="text-xs sm:text-sm font-bold text-stone-100 block group-hover:text-amber-400 transition truncate">
                      Edit "Timeless Wedding Gallery" Stream 1
                    </strong>
                    <span className="text-[10px] text-stone-500 font-mono block">
                      Upper Marquee Stream
                    </span>
                  </div>
                </Link>

                {/* Stream  2 */}
                <Link
                  href="/admin/new-stream?mode=cinematic"
                  onClick={() => setShowSettingsModal(false)}
                  className="group bg-stone-950 border border-stone-800 hover:border-amber-500/60 p-4 rounded-2xl transition-all duration-300 flex items-center gap-3.5 shadow-lg active:scale-95"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition">
                    🎥
                  </div>
                  <div className="overflow-hidden">
                    <strong className="text-xs sm:text-sm font-bold text-stone-100 block group-hover:text-amber-400 transition truncate">
                      Edit "Cinematic Reels & Highlight Stories" Stream 2
                    </strong>
                    <span className="text-[10px] text-stone-500 font-mono block">
                      Lower 3D Deck & Reels
                    </span>
                  </div>
                </Link>

                {/* BTS Stream  3  */}
                <button
                  type="button"
                  onClick={() => setCurrentModalView('bts')}
                  className="group bg-stone-950 border border-amber-500/40 hover:border-amber-400 p-4 rounded-2xl transition-all duration-300 flex items-center gap-3.5 shadow-lg active:scale-95 text-left cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition">
                    🎬
                  </div>
                  <div className="overflow-hidden">
                    <strong className="text-xs sm:text-sm font-bold text-stone-100 block group-hover:text-amber-400 transition truncate">
                      Edit "Behind The Lens" Stream 3
                    </strong>
                    <span className="text-[10px] text-stone-500 font-mono block">
                      Manage Shooting Photos
                    </span>
                  </div>
                </button>

                {/* Legal Terms */}
                <Link
                  href="/admin/terms"
                  onClick={() => setShowSettingsModal(false)}
                  className="group bg-stone-950 border border-stone-800 hover:border-stone-700 p-4 rounded-2xl transition-all duration-300 flex items-center gap-3.5 shadow-lg active:scale-95"
                >
                  <div className="w-12 h-12 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition">
                    📜
                  </div>
                  <div className="overflow-hidden">
                    <strong className="text-xs sm:text-sm font-bold text-stone-100 block group-hover:text-amber-400 transition truncate">
                      Edit Legal Terms
                    </strong>
                    <span className="text-[10px] text-stone-500 font-mono block">
                      Contracts Clauses
                    </span>
                  </div>
                </Link>

                {/* Packages */}
                <Link
                  href="/admin/packages"
                  onClick={() => setShowSettingsModal(false)}
                  className="group bg-stone-950 border border-stone-800 hover:border-stone-700 p-4 rounded-2xl transition-all duration-300 flex items-center gap-3.5 shadow-lg active:scale-95"
                >
                  <div className="w-12 h-12 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition">
                    📦
                  </div>
                  <div className="overflow-hidden">
                    <strong className="text-xs sm:text-sm font-bold text-stone-100 block group-hover:text-amber-400 transition truncate">
                      Edit Packages & Pricing
                    </strong>
                    <span className="text-[10px] text-stone-500 font-mono block">
                      Manage Plans
                    </span>
                  </div>
                </Link>

                {/* Bookings Directory */}
                <Link
                  href="/admin/bookings"
                  onClick={() => setShowSettingsModal(false)}
                  className="group bg-stone-950 border border-stone-800 hover:border-stone-700 p-4 rounded-2xl transition-all duration-300 flex items-center gap-3.5 shadow-lg active:scale-95"
                >
                  <div className="w-12 h-12 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition">
                    📅
                  </div>
                  <div className="overflow-hidden">
                    <strong className="text-xs sm:text-sm font-bold text-stone-100 block group-hover:text-amber-400 transition truncate">
                      Bookings Directory
                    </strong>
                    <span className="text-[10px] text-stone-500 font-mono block">
                      Full Inquiries List
                    </span>
                  </div>
                </Link>

                {/* History Vault Button */}
                <button
                  type="button"
                  onClick={() => setCurrentModalView('history')}
                  className="group bg-stone-950 border border-amber-500/30 hover:border-amber-400 p-4 rounded-2xl transition-all duration-300 flex items-center gap-3.5 shadow-lg active:scale-95 sm:col-span-2 md:col-span-3 text-left cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl shrink-0">
                    🗄️
                  </div>
                  <div>
                    <strong className="text-xs sm:text-sm font-bold text-stone-100 block group-hover:text-amber-400 transition truncate">
                      Booking History - (🗑️ BIN ) 
                    </strong>
                    <span className="text-[10px] text-stone-400 font-mono block">
                      {historyList.length} Archived Booking Records
                    </span>
                  </div>
                </button>

              </div>
            ) : currentModalView === 'bts' ? (
              /* 🎬 BTS STREAM MANAGER VIEW (UP TO 100MB VIDEO/PHOTO) */
              <div className="space-y-4 pt-1 font-sans">
                <div className="flex justify-between items-center bg-stone-950 p-3 rounded-xl border border-stone-800">
                  <span className="text-xs font-bold text-amber-400 font-mono">
                    🎬 Edit BTS & Studio At Work Stream
                  </span>
                  <button
                    onClick={() => setCurrentModalView('grid')}
                    className="text-xs font-bold text-stone-300 hover:text-amber-400 transition font-mono cursor-pointer"
                  >
                    ← Back to Setting
                  </button>
                </div>

                {/* UPLOAD FROM GALLERY BOX */}
                <div className="bg-stone-950 p-4 rounded-2xl border border-amber-500/30 space-y-2 text-center">
                  <span className="text-[10px] text-amber-400 font-mono font-bold uppercase block tracking-wider">
                    📱 UPLOAD FROM GALLERY (UP TO 100MB VIDEO/PHOTO)
                  </span>
                  
                  <input
                    type="file"
                    ref={btsFileInputRef}
                    accept="image/*,video/*"
                    onChange={handleBtsFileUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => btsFileInputRef.current?.click()}
                    className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-5 py-3 rounded-xl text-xs font-mono uppercase tracking-wider transition shadow-lg active:scale-95 cursor-pointer w-full"
                  >
                    📂 SELECT PHOTO/VIDEO FROM GALLERY
                  </button>
                </div>

                {/* ADD VIA URL FORM */}
                <form onSubmit={handleAddBtsItem} className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-3">
                  <span className="text-[10px] text-stone-400 font-mono font-bold uppercase block">
                    🔗 OR ADD VIA DIRECT URL LINK
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <input
                      type="text"
                      placeholder="Media URL (e.g. https://...)"
                      value={newBtsUrl}
                      onChange={(e) => setNewBtsUrl(e.target.value)}
                      className="bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Title (e.g. Sony FX3 Cinema Rig Setup)"
                      value={newBtsTitle}
                      onChange={(e) => setNewBtsTitle(e.target.value)}
                      className="bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-200 font-black px-4 py-2 rounded-xl text-xs font-mono uppercase cursor-pointer transition border border-stone-700"
                  >
                    + Add URL Link
                  </button>
                </form>

                {/* BTS ACTIVE MEDIA GRID */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-1">
                  {btsList.map((item) => (
                    <div key={item.id} className="bg-stone-950 border border-stone-800 p-2 rounded-xl space-y-2 relative group">
                      <img src={item.url} alt={item.title} className="w-full h-28 object-cover rounded-lg" />
                      <p className="text-[10px] font-mono text-stone-300 truncate">{item.title || 'BTS'}</p>
                      <button
                        type="button"
                        onClick={() => handleDeleteBtsItem(item.id)}
                        className="w-full bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:bg-rose-600 hover:text-white text-[10px] font-bold py-1 rounded-lg transition cursor-pointer font-mono"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* 📜 HISTORY VAULT VIEW */
              <div className="space-y-3 pt-1">
                <div className="flex justify-between items-center bg-stone-950 p-3 rounded-xl border border-stone-800">
                  <span className="text-xs font-bold text-amber-400 font-mono">
                    📜 Archived Booking History ({historyList.length})
                  </span>
                  <button
                    onClick={() => setCurrentModalView('grid')}
                    className="text-xs font-bold text-stone-300 hover:text-amber-400 transition font-mono cursor-pointer"
                  >
                    ← Back to Setting
                  </button>
                </div>

                {historyList.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-stone-800 rounded-xl bg-stone-950">
                    <p className="text-xs text-stone-500 italic">Booking History vault is currently empty.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-80">
                    <table className="w-full text-left text-xs min-w-125">
                      <thead className="bg-stone-950 text-stone-400 font-semibold border-b border-stone-800 sticky top-0 font-mono">
                        <tr>
                          <th className="p-2.5">Ref ID</th>
                          <th className="p-2.5">Client Details</th>
                          <th className="p-2.5">Valuation</th>
                          <th className="p-2.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-800/60">
                        {historyList.map((item, idx) => (
                          <tr key={idx} className="hover:bg-stone-950 transition">
                            <td className="p-2.5 font-mono text-amber-400 font-bold">{item.bookingNumber}</td>
                            <td className="p-2.5">
                              <strong className="text-stone-200 block">{item.clientName || item.customerName}</strong>
                              <span className="text-stone-500 text-[10px]">{item.clientPhone || item.customerPhone}</span>
                            </td>
                            <td className="p-2.5 font-mono font-bold text-stone-300">
                              ₹{item.totalAmount?.toLocaleString('en-IN')}
                            </td>
                            <td className="p-2.5 text-right space-x-2 whitespace-nowrap">
                              <button
                                onClick={() => handleRestoreFromHistory(item.bookingNumber)}
                                className="bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600 hover:text-white font-bold px-2.5 py-1 rounded-lg text-[10px] transition cursor-pointer"
                              >
                                🔄 Restore
                              </button>
                              <button
                                onClick={() => handlePermanentDelete(item.bookingNumber)}
                                className="bg-rose-950/60 border border-rose-500/40 text-rose-400 hover:bg-rose-600 hover:text-white p-1 rounded-lg text-[10px] transition cursor-pointer"
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            <div className="pt-3 border-t border-stone-800 text-right">
              <button
                onClick={() => setShowSettingsModal(false)}
                type="button"
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer font-mono"
              >
                Close Settings
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-950 text-amber-400 flex items-center justify-center font-mono text-xs">
        ⏳ Loading Control Center...
      </div>
    }>
      <AdminDashboardContent />
    </Suspense>
  );
}