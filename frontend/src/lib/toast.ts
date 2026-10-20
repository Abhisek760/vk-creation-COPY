export const notify = {
  success: (message: string) => {
    if (typeof window !== "undefined") {
      alert(`✅ Success: ${message}`);
    }
  },
  error: (message: string) => {
    if (typeof window !== "undefined") {
      alert(`❌ Error: ${message}`);
    }
  },
  info: (message: string) => {
    if (typeof window !== "undefined") {
      alert(`ℹ️ Info: ${message}`);
    }
  },
};

export const toast = notify;
export default toast;