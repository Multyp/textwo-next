"use client"

/* Global import */
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
/* Scoped import */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
/* Local imports */
import MobileDropdown from '@/components/home/MobileDropdown';
import { getUsersRoute } from '@/utils/ApiRoutes';
import User from '@/types/User';

interface Props {
  currentUser: User;
  isMenuOpen: boolean;
  closeMenu: () => void;
  isMobileDropdownOpen: boolean;
  closeMobileDropdown: () => void;
  mobileDropdownRef: React.RefObject<HTMLDivElement>;
  menuRef: React.RefObject<HTMLDivElement>;
  toggleMobileDropdown: () => void;
  setCurrentChat: (user: User) => void;
  currentChat: User | undefined;
}

const MobileLayout: React.FC<Props> = ({
  currentUser,
  isMenuOpen,
  closeMenu,
  isMobileDropdownOpen,
  closeMobileDropdown,
  mobileDropdownRef,
  menuRef,
  toggleMobileDropdown,
  setCurrentChat,
  currentChat,
}) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${getUsersRoute}/${currentUser._id}`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [currentUser._id]);

  const handleUserClick = (user: User) => {
    if (user !== currentChat) {
      setCurrentChat(user);
    }
  };

  return (
    <div ref={menuRef} className={`bg-gray-900 h-[100dvh] w-64 absolute top-0 left-0 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
      <div className="flex flex-col justify-end h-full">
        <div className="mt-2 px-4 h-12 w-full flex items-center justify-between text-white">
            Your chats
            <FontAwesomeIcon icon={faTimes} className="!h-6 w-6 text-white cursor-pointer" onClick={closeMenu}/>
        </div>
        <div className="p-4 flex-grow">
          {users.map(user => (
            <div key={user._id} className="hover:bg-gray-800 p-2 cursor-pointer rounded-md flex items-center" onClick={() => handleUserClick(user)}>
              {user.avatarImage !== "" ? (
                <Image
                  src={`data:image/svg+xml;base64,${user.avatarImage}`}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                  width={50}
                  height={50}
                />
              ) : (
                <Image
                  src="/blank-profile-picture.png"
                  alt="Blank Profile Picture"
                  className="w-8 h-8 rounded-full"
                  width={50}
                  height={50}
                />
              )}
              <span className="text-white ml-2">{user.username}</span>
            </div>
          ))}
        </div>
        <div className="flex w-full justify-center items-center">
          <div className="border-t border-gray-700 w-11/12"/>
        </div>
        <div className="p-4 flex items-center justify-between">
          <div className="relative w-full">
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-500 w-full rounded-md p-2" onClick={toggleMobileDropdown}>
              {currentUser.avatarImage !== "" ? (
                <Image
                  src={`data:image/svg+xml;base64,${currentUser.avatarImage}`}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                  width={50}
                  height={50}
                />
              ) : (
                <Image
                  src="/blank-profile-picture.png"
                  alt="Blank Profile Picture"
                  className="w-8 h-8 rounded-full"
                  width={50}
                  height={50}
                />
              )}
              <span className="text-white">{currentUser.username}</span>
            </div>
            {isMobileDropdownOpen && (
              <MobileDropdown currentUserMail={currentUser.email} closeDropdown={closeMobileDropdown} dropdownRef={mobileDropdownRef}/>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileLayout;
