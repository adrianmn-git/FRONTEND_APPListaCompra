"use client";

import React, { useRef, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faCloudArrowUp,
  faTrash,
  faSpinner,
  faFileImage,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { useScanList } from "../hooks/useScanList";
import { useI18n } from "@/i18n/hooks/useI18n";

export default function ScanListUploader() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { scanImages, isScanning } = useScanList();
  const { t } = useI18n();

  const addFiles = useCallback((files: FileList | File[]) => {
    const newFiles = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (newFiles.length === 0) return;

    setSelectedFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleSubmit = async () => {
    if (selectedFiles.length === 0 || isScanning) return;
    await scanImages(selectedFiles);
  };

  return (
    <section className="space-y-8">
      {/* Format Guide */}
      <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div className="flex items-center justify-center w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 shrink-0">
            <FontAwesomeIcon
              icon={faCircleInfo}
              className="text-indigo-500 text-xl"
            />
          </div>
          <div>
            <h3 className="font-black text-slate-800 text-lg">
              {t("scan.format_title", {
                defaultValue: "Expected format",
              })}
            </h3>
            <p className="text-sm text-slate-500 font-medium">For best results, please follow this structure in your picture.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm font-mono leading-relaxed relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
            <p className="font-black text-indigo-600 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              {t("scan.format_complete", {
                defaultValue: "Complete list",
              })}
            </p>
            <div className="pl-4 border-l-2 border-slate-100 space-y-1 mt-3">
              <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">LIST NAME</p>
              <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">SUPERMARKET</p>
              <p className="text-slate-300 text-[10px] my-2">───────────</p>
              <p className="text-slate-700">Apples 3u</p>
              <p className="text-slate-700">Milk 1L</p>
              <p className="text-slate-700">Chicken 500g</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm font-mono leading-relaxed relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
            <p className="font-black text-emerald-600 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {t("scan.format_continuation", {
                defaultValue: "Continuation page",
              })}
            </p>
            <div className="pl-4 border-l-2 border-slate-100 space-y-1 mt-3">
              <p className="text-slate-700">Rice 1kg</p>
              <p className="text-slate-700">Olive Oil 750ml</p>
              <p className="text-slate-700">Bread 2u</p>
              <p className="text-slate-700">Yogurt 4u</p>
            </div>
          </div>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-6 p-12 md:p-16 border-2 border-dashed rounded-[2.5rem] cursor-pointer transition-all duration-500 overflow-hidden ${
          isDragging
            ? "border-indigo-500 bg-indigo-50/80 scale-[1.02] shadow-2xl shadow-indigo-200/50"
            : "border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-slate-100 hover:shadow-lg"
        }`}
      >
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-50/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        <div
          className={`relative z-10 flex items-center justify-center w-24 h-24 rounded-[2rem] transition-all duration-500 shadow-xl ${
            isDragging
              ? "bg-indigo-600 scale-110 shadow-indigo-300"
              : "bg-white border border-slate-100 shadow-slate-200/50"
          }`}
        >
          <FontAwesomeIcon
            icon={faCloudArrowUp}
            className={`text-4xl transition-colors duration-500 ${isDragging ? "text-white" : "text-indigo-500"}`}
          />
        </div>
        <div className="text-center relative z-10">
          <p className="text-xl font-black text-slate-800 mb-2">
            {t("scan.drop_title", {
              defaultValue: "Drop your images here",
            })}
          </p>
          <p className="text-base text-slate-500 font-medium">
            {t("scan.drop_subtitle", {
              defaultValue: "or click to browse files",
            })}
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
            <FontAwesomeIcon icon={faFileImage} className="text-slate-400" />
            {t("scan.selected_images", {
              defaultValue: "Selected images",
            })}{" "}
            ({previews.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previews.map((src, i) => (
              <div key={i} className="relative group rounded-3xl overflow-hidden shadow-sm border border-slate-200 aspect-square">
                <img
                  src={src}
                  alt={`Preview ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/30 transition-colors duration-300"></div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(i);
                  }}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-lg hover:bg-red-500 hover:text-white transform translate-y-2 group-hover:translate-y-0"
                  aria-label={t("common.delete", { defaultValue: "Delete" })}
                >
                  <FontAwesomeIcon icon={faTrash} className="text-sm" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4">
            {/* Scan Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isScanning}
              className="w-full flex items-center justify-center gap-3 py-4 md:py-5 px-8 bg-slate-900 hover:bg-slate-800 text-white font-black text-lg rounded-full shadow-xl shadow-slate-900/20 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer group active:scale-[0.98]"
            >
              {isScanning ? (
                <>
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="animate-spin text-xl"
                  />
                  {t("scan.scanning", {
                    defaultValue: "Analyzing images...",
                  })}
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCamera} className="text-xl group-hover:scale-110 transition-transform" />
                  {t("scan.scan_button", {
                    defaultValue: "Scan Shopping List",
                  })}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
