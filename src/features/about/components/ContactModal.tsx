"use client";

import { X, Mail, BookText, Copy } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { profile } from "@/features/about/data/about";
import { useState } from "react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handleEmailCopy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // 2초 후 원래 상태로
    } catch (error) {
      console.error("Failed to copy email:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white">Contact</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center shrink-0">
              <Mail size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="font-medium text-black dark:text-white truncate">{profile.email}</p>
            </div>
            <button
              onClick={handleEmailCopy}
              className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2"
            >
              <Copy size={14} />
              {isCopied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div className="space-y-3">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-gray-200 dark:bg-zinc-700 rounded-full flex items-center justify-center shrink-0">
                <FaGithub size={24} className="text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <p className="font-medium text-black dark:text-white">GitHub</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">View my projects</p>
              </div>
            </a>

            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center shrink-0">
                <FaLinkedin size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-black dark:text-white">LinkedIn</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Connect with me</p>
              </div>
            </a>

            <a
              href={profile.blog}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center shrink-0">
                <BookText size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-black dark:text-white">Blog</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Read my posts</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}