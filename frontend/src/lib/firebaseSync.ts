import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// 📦 PACKAGES CLOUD SYNC
export const savePackagesCloud = async (packagesData: any[]) => {
  try {
    localStorage.setItem('vk_creation_packages_v1', JSON.stringify(packagesData));
    await setDoc(doc(db, 'settings', 'packages'), {
      list: packagesData,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.error('Packages Cloud Save Error:', err);
    return false;
  }
};

export const loadPackagesCloud = async () => {
  try {
    const docRef = doc(db, 'settings', 'packages');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data().list;
      localStorage.setItem('vk_creation_packages_v1', JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.error('Packages Cloud Load Error:', err);
  }
  const local = localStorage.getItem('vk_creation_packages_v1');
  return local ? JSON.parse(local) : null;
};

// 📄 TERMS & CONDITIONS CLOUD SYNC
export const saveTermsCloud = async (termsData: any) => {
  try {
    localStorage.setItem('vk_creation_terms_v1', JSON.stringify(termsData));
    await setDoc(doc(db, 'settings', 'terms'), {
      content: termsData,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.error('Terms Cloud Save Error:', err);
    return false;
  }
};

export const loadTermsCloud = async () => {
  try {
    const docRef = doc(db, 'settings', 'terms');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data().content;
      localStorage.setItem('vk_creation_terms_v1', JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.error('Terms Cloud Load Error:', err);
  }
  const local = localStorage.getItem('vk_creation_terms_v1');
  return local ? JSON.parse(local) : null;
};