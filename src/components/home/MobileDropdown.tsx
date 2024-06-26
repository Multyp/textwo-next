"use client"

/* Global import */
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
/* Scoped import */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
/* Local imports */

interface MobileDropdownProps {
  currentUserMail: string;
  closeDropdown: () => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex w-screen items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-4 rounded-lg">
        <p className="text-lg">{message}</p>
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 mr-2 bg-gray-300 hover:bg-gray-400 rounded"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const MobileDropdown: React.FC<MobileDropdownProps> = ({ currentUserMail, closeDropdown, dropdownRef }) => {
  const navigation = useRouter();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    navigation.push("/")
  };

  const cancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  return (
    <div ref={dropdownRef} className="absolute right-0 top-auto bottom-full my-2 w-full bg-gray-600 border border-gray-500 border-opacity-80 rounded-md shadow-lg">
      <div className="py-1 justify-center">
        <div className="px-4 py-2 flex items-center justify-between">
          <span className="text-white">{currentUserMail}</span>
        </div>
        <div className="flex w-full justify-center items-center">
          <div className="border-t border-gray-500 w-11/12"/>
        </div>
        <div className="px-4 py-2 flex items-center">
          <FontAwesomeIcon icon={faCog} className="h-5 w-5 text-white cursor-pointer mr-2" />
          <span className="text-white">Settings</span>
        </div>
        <div className="flex w-full justify-center items-center">
          <div className="border-t border-gray-500 w-11/12"/>
        </div>
        <div className="pl-3 py-2 flex items-center hover:bg-gray-500 rounded-md w-full" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5 text-white cursor-pointer mr-2" />
          <button className="text-white">Logout</button>
        </div>
      </div>
      {showLogoutConfirmation && (
        <ConfirmationModal
          message="Are you sure you want to logout?"
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
        />
      )}
    </div>
  );
};

export default MobileDropdown;
