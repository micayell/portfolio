"use client";

import { X, Mail, BookText } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { profile } from "@/data/about";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  if (!isOpen) return null;

  const handleEmailCopy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      alert("이메일이 복사되었습니다!");
    } catch (error) {
      console.error("Failed to copy email:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black dark:text-white">Contact</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Mail size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="font-medium text-black dark:text-white">{profile.email}</p>
            </div>
            <button
              onClick={handleEmailCopy}
              className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
            >
              Copy
            </button>
          </div>

          <div className="space-y-3">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-gray-200 dark:bg-zinc-700 rounded-full flex items-center justify-center">
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
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
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
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
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
