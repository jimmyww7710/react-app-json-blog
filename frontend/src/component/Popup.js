import React from 'react';
import '../style/Popup.css';

const Popup = ({ isOpen, popupId, closePopup, callBack, title }) => {
  if (!isOpen) return null; // Don't render if not open

  const callbackfunc = async () => {
    callBack(popupId);
    closePopup();
  };

  return (
    <div className="popup-overlay" onClick={closePopup}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-5">{title}</h2>
        <div className="flex justify-center">
          <button onClick={callbackfunc} className="px-4 py-2 border-2 border-blue-600 bg-blue-600 text-white rounded hover:bg-blue-700">Confirm</button>
          <div className="w-2"></div>
          <button onClick={closePopup} className="px-4 py-2 border-2 border-gray-500 text-gray-700 rounded hover:bg-gray-100">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;