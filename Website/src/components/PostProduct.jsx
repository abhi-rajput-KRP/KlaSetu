import { useRef, useState } from "react";
import { Link } from "react-router";
import {
  ImagePlus,
  Mic,
  Square,
  Trash2,
  Play,
  Pause,
  Sparkles,
  MapPin,
  Store,
  Package,
} from "lucide-react";
import { CRAFT_CATEGORIES } from "../data/productsData";

export default function PostProduct() {
  const [image, setImage] = useState(
    "https://blocks.astratic.com/img/general-img-landscape.png"
  );
  const [imageFile, setImageFile] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [material, setMaterial] = useState("");
  const [makerName, setMakerName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [story, setStory] = useState("");

  const [recordingUri, setRecordingUri] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [brochureReady, setBrochureReady] = useState(false);

  const galleryInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlayerRef = useRef(null);

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImage(URL.createObjectURL(file));
  };

  const pick = () => galleryInputRef.current?.click();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setRecordingUri(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      // If no mic access or testing environment, simulate audio recording
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setRecordingUri("simulated-audio");
      }, 3000);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const togglePlayback = () => {
    if (audioPlayerRef.current) {
      if (isPlaying) {
        audioPlayerRef.current.pause();
        setIsPlaying(false);
      } else {
        audioPlayerRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const removeRecording = () => {
    setRecordingUri(null);
    setIsPlaying(false);
  };

  const handleGenerateBrochure = async () => {
    if (!name) {
      alert("Please provide at least a craft title.");
      return;
    }
    setGenerating(true);
    await new Promise((res) => setTimeout(res, 1500));
    setGenerating(false);
    setBrochureReady(true);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        {/* Header Title */}
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F3E6D3] px-3.5 py-1 text-xs font-bold text-[#B5652F] mb-3">
            <Sparkles size={14} />
            <span>AI powered Product Posting </span>
          </div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#2B2420]">
            Sell your craft to the world
          </h1>
          <p className="mt-2 text-sm text-[#8A8078] leading-relaxed">
            Upload a photo, record a description in your own voice, and our AI Studio will create a catalog listing and shareable product post.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Link
              to="/studio"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#EDE4D6] bg-white px-4 py-2 text-xs font-bold text-[#3C6E47] hover:bg-[#EBF3EC] transition-colors shadow-2xs"
            >
              <Package size={14} />
              <span>Go to Artisan Studio & Inventory Manager →</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

          {/* Left: Input Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">

            {/* Step 1: Product Photo */}
            <div className="rounded-3xl border border-[#EDE4D6] bg-[#FFFDF9] p-5 sm:p-6 card-shadow space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-[#2B2420] flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3C6E47] text-[11px] font-bold text-white">1</span>
                  Craft Photo
                </label>
                <span className="text-xs text-[#8A8078]">Clear, natural light recommended</span>
              </div>

              <div
                onClick={pick}
                className="relative flex aspect-16/9 w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#EDE4D6] bg-[#F3E6D3]/40 transition-colors hover:bg-[#F3E6D3]/70"
              >
                {image ? (
                  <>
                    <img src={image} alt="Artisan preview" className="h-full w-full object-contain" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[#2B2420] shadow">
                        Change Image
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-center p-6">
                    <ImagePlus size={36} className="text-[#3C6E47] mb-2" />
                    <p className="text-xs font-semibold text-[#2B2420]">Click to upload craft photo</p>
                    <p className="text-[11px] text-[#8A8078]">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                )}
              </div>

              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelected}
              />
            </div>

            {/* Step 2: Voice Description Audio */}
            <div className="rounded-3xl border border-[#EDE4D6] bg-[#FFFDF9] p-5 sm:p-6 card-shadow space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-[#2B2420] flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3C6E47] text-[11px] font-bold text-white">2</span>
                  Record the Description in Your Voice
                </label>
                <span className="text-xs text-[#B5652F] font-semibold">Any Indian Language</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-[#F3E6D3]/50 border border-[#EDE4D6] p-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-[#EBF3EC] text-[#3C6E47]'}`}>
                    <Mic size={22} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#2B2420]">
                      {isRecording ? 'Recording your voice...' : recordingUri ? 'Voice Story Recorded ✓' : "Record the product's Description in your language"}
                    </p>
                    <p className="text-[11px] text-[#8A8078]">
                      {isRecording ? 'Tap stop when done' : 'AI will extract product details & craft a story'}
                    </p>
                  </div>
                </div>

                <div>
                  {isRecording ? (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow"
                    >
                      <Square size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3C6E47] text-white hover:bg-[#2F5838] transition-colors shadow"
                    >
                      <Mic size={18} />
                    </button>
                  )}
                </div>
              </div>

              {recordingUri && (
                <div className="flex items-center justify-between rounded-xl bg-[#EBF3EC] px-4 py-2 text-xs font-semibold text-[#3C6E47]">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={togglePlayback} className="p-1 hover:text-[#2F5838]">
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <span>Description audio recorded</span>
                  </div>
                  <button type="button" onClick={removeRecording} className="text-[#C77B3E] hover:underline flex items-center gap-1">
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                  {recordingUri !== 'simulated-audio' && (
                    <audio ref={audioPlayerRef} src={recordingUri} onEnded={() => setIsPlaying(false)} className="hidden" />
                  )}
                </div>
              )}
            </div>

            {/* Step 3: Craft Details Form */}
            <div className="rounded-3xl border border-[#EDE4D6] bg-[#FFFDF9] p-5 sm:p-6 card-shadow space-y-4">
              <label className="text-sm font-bold text-[#2B2420] flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3C6E47] text-[11px] font-bold text-white">3</span>
                Craft Details
              </label>

              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <label className="block font-medium text-[#2B2420] mb-1">Product Title</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-[#EDE4D6] px-3.5 py-2.5 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none"
                    placeholder="e.g. Hand-Thrown Terracotta Urn"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-[#2B2420] mb-1">Craft Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-[#EDE4D6] px-3 py-2.5 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none cursor-pointer"
                    >
                      {CRAFT_CATEGORIES.filter((c) => c !== "All Crafts").map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-[#2B2420] mb-1">Price (₹ INR)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full rounded-xl border border-[#EDE4D6] px-3.5 py-2.5 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none"
                      placeholder="e.g. 48"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block font-medium text-[#2B2420] mb-1">Description</label>
                    <textarea
                      value={story}
                      onChange={(e) => setStory(e.target.value)}
                      className="w-full rounded-xl border border-[#EDE4D6] px-3.5 py-2 h-30 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none"
                    />
                  </div>

                  {/* hide the location input*/}
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-[#EDE4D6] px-3.5 py-2.5 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none hidden"
                  />

                </div>

                <div>
                  <label className="block font-medium text-[#2B2420] mb-1">Materials Used</label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full rounded-xl border border-[#EDE4D6] px-3.5 py-2.5 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none"
                    placeholder="e.g. Pure Himalayan Wool, Walnut Natural Dye"
                  />
                </div>
              </div>

              {/* Generate AI Brochure Pill CTA */}
              <button
                type="button"
                disabled={generating}
                onClick={handleGenerateBrochure}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#3C6E47] py-3.5 px-6 text-sm font-bold text-white shadow-md transition-all hover:bg-[#2F5838] active:scale-98 disabled:opacity-50"
              >
                <Sparkles size={18} className="text-[#F5B301]" />
                <span>{generating ? "Synthesizing AI Craft Story & Brochure..." : "Generate AI Brochure & Listing"}</span>
              </button>
            </div>

          </div>

          {/* Right: Live Preview of AI Marketing Brochure Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="sticky top-28">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8A8078]">
                  <img src="/favicon.svg" alt="KlaSetu Logo" className="h-8 w-8" />
                  <span className="font-serif-heading font-bold text-sm tracking-wide">KlaSetu Product Overview</span>
                </div>
              </div>

              {/* Live Brochure Card */}
              <div className="overflow-hidden rounded-3xl border-2 border-[#EDE4D6] bg-[#FFFDF9] shadow-xl">

                {/* Photo */}
                <div className="relative aspect-4/3 w-full bg-[#F3E6D3]">
                  <img src={image} alt="Brochure preview" className="h-full w-full object-contain" />
                  <div className="absolute bottom-3 right-3 rounded-full bg-[#2B2420]/80 backdrop-blur-xs px-3 py-1 text-xs font-bold text-white">
                    ₹{price} INR
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#8A8078]">
                    <span className="font-semibold text-[#B5652F]">{makerName}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {location}</span>
                  </div>

                  <h3 className="font-serif-heading text-lg font-bold text-[#2B2420] leading-snug">
                    {name}
                  </h3>

                  <p className="text-xs leading-relaxed text-[#8A8078] line-clamp-3">
                    {story}
                  </p>

                  <div className="rounded-xl bg-[#F3E6D3]/60 p-3 text-[11px] text-[#2B2420]">
                    <strong className="block text-[#3C6E47] font-semibold">Materials & Provenance:</strong>
                    {material}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}