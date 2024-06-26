"use client"

/* Global imports */
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { BeatLoader } from 'react-spinners';
import { Socket, io } from "socket.io-client";
/* Scoped imports */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
/* Local imports */
import MobileLayout from '@/components/home/MobileLayout';
import LargeLayout from '@/components/home/LargeLayout';
import Welcome from '@/components/home/Welcome';
import ChatContainer from '@/components/home/ChatContainer';
import User from '@/types/User';

const Home: React.FC = () => {
  const router = useRouter();
  const socket = useRef<Socket| null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isLargeDropdownOpen, setIsLargeDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [currentChat, setCurrentChat] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const largeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkLoggedIn = () => {
      const loggedIn = !!localStorage.getItem('token');
      if (!loggedIn) {
        router.push('/login');
      } else {
        setIsLoggedIn(true);
      }
    };

    checkLoggedIn();
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await JSON.parse(localStorage.getItem("token") as string) as User;
      if (data) {
        setCurrentUser(data);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
        setIsMobileDropdownOpen(false);
      }
      if (largeDropdownRef.current && !largeDropdownRef.current.contains(event.target as Node)) {
        setIsLargeDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        closeMenu();
        closeMobileDropdown();
        closeLargeDropdown();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (currentUser?._id) {
      socket.current = io("https://api.textwo.app");
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  const toggleMobileDropdown = () => {
    setIsMobileDropdownOpen(!isMobileDropdownOpen);
  };

  const closeMobileDropdown = () => {
    setIsMobileDropdownOpen(false);
  };

  const toggleLargeDropdown = () => {
    setIsLargeDropdownOpen(!isLargeDropdownOpen);
  };

  const closeLargeDropdown = () => {
    setIsLargeDropdownOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <BeatLoader color="#4A90E2" loading={isLoading} size={20} />
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className="h-full flex flex-row">
        <MobileLayout
          currentUser={currentUser as User}
          isMenuOpen={isMenuOpen}
          closeMenu={closeMenu}
          isMobileDropdownOpen={isMobileDropdownOpen}
          closeMobileDropdown={closeMobileDropdown}
          menuRef={menuRef}
          mobileDropdownRef={mobileDropdownRef}
          toggleMobileDropdown={toggleMobileDropdown}
          currentChat={currentChat}
          setCurrentChat={setCurrentChat}
        />
        <LargeLayout
          currentUser={currentUser as User}
          isLargeDropdownOpen={isLargeDropdownOpen}
          largeDropdownRef={largeDropdownRef}
          toggleLargeDropdown={toggleLargeDropdown}
          currentChat={currentChat}
          setCurrentChat={setCurrentChat}
        />
        <div className="flex-1 bg-gray-700 w-full h-full">
          <div className={`h-16 w-16 flex items-center justify-center cursor-pointer ${isMenuOpen ? "hidden" : "absolute"} md:hidden`} onClick={toggleMenu}>
            <FontAwesomeIcon icon={faBars} className="!h-6 w-6 text-white" />
          </div>
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentContact={currentChat} socket={socket as any} />
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default Home;
