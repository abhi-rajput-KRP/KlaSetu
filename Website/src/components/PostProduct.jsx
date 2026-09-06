import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  ImagePlus,
  Mic,
  Square,
  Trash2,
  Play,
  Pause,
  Sparkles,
  MapPin,
  Package,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldAlert,
  Sliders,
  DollarSign,
  Tag,
  Languages,
} from "lucide-react";
import { CRAFT_CATEGORIES } from "../data/productsData";
import { useShop } from "../context/ShopContext";
import { pipelineAPI, marketAPI, getImageUrl } from "../utils/Backend";

export default function PostProduct() {
  const { user, isArtisan, addProduct, showToast } = useShop();
  const navigate = useNavigate();

  // Input states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Audio recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUri, setRecordingUri] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordTimer, setRecordTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Form states
  const [initialTitle, setInitialTitle] = useState("");
  const [category, setCategory] = useState("Ceramics & Pottery");
  const [language, setLanguage] = useState("hi");
  const [materialCost, setMaterialCost] = useState(350);
  const [labourCost, setLabourCost] = useState(250);

  // AI Pipeline Output states
  const [isProcessingPipeline, setIsProcessingPipeline] = useState(false);
  const [pipelineFinished, setPipelineFinished] = useState(false);
  const [pipelineError, setPipelineError] = useState("");

  // Curated fields after pipeline
  const [curatedNameEn, setCuratedNameEn] = useState("");
  const [curatedNameHi, setCuratedNameHi] = useState("");
  const [curatedDescEn, setCuratedDescEn] = useState("");
  const [curatedDescHi, setCuratedDescHi] = useState("");
  const [curatedMaterial, setCuratedMaterial] = useState("");
  const [curatedCategory, setCuratedCategory] = useState("");
  const [curatedTags, setCuratedTags] = useState([]);
  const [enhancedImagePath, setEnhancedImagePath] = useState("");
  const [pricingBreakdown, setPricingBreakdown] = useState(null);
  const [finalPrice, setFinalPrice] = useState(750);
  const [inStockUnits, setInStockUnits] = useState(12);

  // Publish state
  const [isPublishing, setIsPublishing] = useState(false);

  // Refs
  const galleryInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlayerRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      timerIntervalRef.current = setInterval(() => {
        setRecordTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
      setRecordTimer(0);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [isRecording]);

  // If user is not an artisan, show permission screen
  if (!user || !isArtisan) {
    return (
      <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 py-16 bg-[#FFFDF9]">
        <div className="mx-auto max-w-md text-center rounded-3xl border border-[#EDE4D6] bg-white p-8 card-shadow space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F3E6D3] text-[#B5652F] border border-[#EDE4D6]">
            <ShieldAlert size={32} />
          </div>
          <div className="space-y-2">
            <span className="inline-block rounded-full bg-[#F3E6D3] px-3 py-1 text-[11px] font-bold text-[#B5652F] uppercase tracking-wider">
              Artisan Guild Portal
            </span>
            <h2 className="font-serif-heading text-2xl font-bold text-[#2B2420]">
              Artisan Account Required
            </h2>
            <p className="text-xs sm:text-sm text-[#8A8078] leading-relaxed">
              The AI Craft Posting Studio is reserved exclusively for registered master craftspeople and sellers to publish authentic handmade works.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              to="/register"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#B5652F] py-3 text-xs sm:text-sm font-bold text-white shadow hover:bg-[#9B5324] transition-all"
            >
              <span>Register as an Artisan / Seller</span>
              <ArrowRight size={15} />
            </Link>
            <Link
              to="/login"
              className="flex w-full items-center justify-center rounded-full border border-[#EDE4D6] bg-white py-3 text-xs sm:text-sm font-bold text-[#2B2420] hover:bg-[#F3E6D3] transition-colors"
            >
              Sign In to Existing Artisan Account
            </Link>
            <Link
              to="/products"
              className="text-xs text-[#8A8078] hover:text-[#3C6E47] pt-2"
            >
              ← Back to Explore Crafts Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // File picker handler
  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/ogg" });
        setAudioBlob(blob);
        setRecordingUri(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.warn("Microphone access unavailable or simulated:", err);
      // Create a fallback sample audio blob
      const dummyBlob = new Blob(["sample audio recording"], { type: "audio/ogg" });
      setAudioBlob(dummyBlob);
      setRecordingUri("simulated-audio");
      showToast("Audio recorded in fallback mode");
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
    setAudioBlob(null);
    setIsPlaying(false);
  };

  // ==================== RUN AI PIPELINE ====================
  const handleRunPipeline = async () => {
    if (!imageFile && !imagePreview) {
      alert("Please upload or capture a photo of your craft item.");
      return;
    }

    setIsProcessingPipeline(true);
    setPipelineError("");

    try {
      // Step 1: Upload image file or fetch blob
      let fileToUpload = imageFile;
      if (!fileToUpload) {
        // Fallback fetch blob
        const res = await fetch(imagePreview);
        const b = await res.blob();
        fileToUpload = new File([b], "craft.jpg", { type: "image/jpeg" });
      }

      // Step 2: Invoke the AI pipeline on backend
      const result = await pipelineAPI.processProduct({
        imageFile: fileToUpload,
        audioBlob: audioBlob,
        language: language,
        materialCost: Number(materialCost) || 0,
        labourCost: Number(labourCost) || 0,
        title: initialTitle,
        category: category,
      });

      // Step 3: Populate curated listing details
      const listing = result.listing || {};
      const pricing = result.pricing || {};

      setCuratedNameEn(listing.product_name_en || initialTitle || "Master-Crafted Heritage Item");
      setCuratedNameHi(listing.product_name_hi || "हस्तनिर्मित शिल्प उत्पाद");
      setCuratedDescEn(
        listing.description_en ||
          "Exquisitely crafted using age-old ancestral techniques with natural, sustainably sourced raw materials."
      );
      setCuratedDescHi(listing.description_hi || "पारंपरिक तकनीकों और प्राकृतिक सामग्रियों से हस्तनिर्मित।");
      setCuratedMaterial(listing.detected_material || "Natural artisanal materials");
      setCuratedCategory(listing.detected_category || category);
      setCuratedTags(listing.tags || ["handcrafted", "artisan", "heritage", "sustainable"]);

      setEnhancedImagePath(result.enhanced_image_path || result.enhanced_image_url || "/bucket/output_image.webp");
      setPricingBreakdown(pricing);
      setFinalPrice(pricing.final_price || Math.round((Number(materialCost) + Number(labourCost)) * 1.35) || 750);

      setPipelineFinished(true);
      showToast("AI Craft Pipeline finished! Review curated listing.");
    } catch (err) {
      console.error("AI Pipeline failed:", err);
      // Graceful fallback so artisan workflow is never blocked
      const fallbackPrice = Math.round((Number(materialCost) + Number(labourCost)) * 1.35) || 750;
      setCuratedNameEn(initialTitle || "Hand-Crafted Artisan Item");
      setCuratedNameHi("हस्तनिर्मित पारंपरिक कृति");
      setCuratedDescEn("Meticulously handcrafted by master artisans celebrating traditional techniques and natural finishes.");
      setCuratedDescHi("प्राकृतिक सामग्री और पारंपरिक तकनीक से निर्मित।");
      setCuratedMaterial("Organic alluvial clay & mineral glaze");
      setCuratedCategory(category);
      setCuratedTags(["handmade", "heritage", "artisan", "craft"]);
      setEnhancedImagePath(imagePreview || "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80");
      setPricingBreakdown({
        material_cost: Number(materialCost) || 350,
        labour_cost: Number(labourCost) || 250,
        base_cost: (Number(materialCost) || 350) + (Number(labourCost) || 250),
        margin_pct: 35,
        final_price: fallbackPrice,
      });
      setFinalPrice(fallbackPrice);
      setPipelineFinished(true);
      setPipelineError("Pipeline ran with fallback data. You can refine fields below.");
    } finally {
      setIsProcessingPipeline(false);
    }
  };

  // ==================== PUBLISH TO MARKETPLACE ====================
  const handlePublish = async () => {
    if (!curatedNameEn) {
      alert("Please ensure product name is set.");
      return;
    }

    setIsPublishing(true);
    try {
      const payload = {
        name: curatedNameEn,
        category: curatedCategory || category,
        maker: user.store_name || user.name || "Master Artisan",
        location: user.location || "India",
        price: Number(finalPrice) || 50,
        original_price: Math.round((Number(finalPrice) || 50) * 1.25),
        material: curatedMaterial,
        technique: "Handcrafted & Traditional Guild Finished",
        in_stock: Number(inStockUnits) || 10,
        min_threshold: 4,
        status: "active",
        rating: 5.0,
        reviews_count: 0,
        badge: "New Craft",
        is_featured: true,
        lead_time: "Ready to ship in 2 days",
        image: enhancedImagePath || imagePreview,
        gallery: [enhancedImagePath || imagePreview],
        description: curatedDescEn,
        description_hi: curatedDescHi,
        story: `Handcrafted in ${user.location || 'India'} by ${user.name}. Every piece celebrates generational knowledge.`,
        dimensions: 'Standard Craft Dimensions',
        weight: '600 g',
        tags: curatedTags,
      };

      await addProduct(payload);
      showToast("Published! Your craft is now live on KlaSetu marketplace.");
      navigate("/studio");
    } catch (err) {
      console.error("Failed to publish craft:", err);
      alert("Error publishing craft. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] py-8 sm:py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F3E6D3] px-3.5 py-1 text-xs font-bold text-[#B5652F] mb-3 border border-[#EDE4D6]">
            <Sparkles size={14} className="text-[#B5652F]" />
            <span>AI Powered Artisan Posting Studio</span>
          </div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#2B2420]">
            Publish your craft to the marketplace
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#8A8078] leading-relaxed">
            Snap your creation, describe it in your own language, and our AI pipeline will enhance the photo, curate the listing, and calculate recommended fair prices.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Flow Steps (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* STEP 1: Photo of Craft Item */}
            <div className="rounded-3xl border border-[#EDE4D6] bg-white p-5 sm:p-6 card-shadow space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-[#2B2420] flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3C6E47] text-xs font-bold text-white">
                    1
                  </span>
                  Capture / Upload Craft Photo
                </label>
                <span className="text-xs text-[#8A8078]">Natural daylight recommended</span>
              </div>

              <div
                onClick={() => galleryInputRef.current?.click()}
                className="relative flex aspect-16/9 w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#EDE4D6] bg-[#F3E6D3]/30 transition-all hover:bg-[#F3E6D3]/60 group"
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Artisan craft preview"
                      className="h-full w-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[#2B2420] shadow">
                        Change Photo
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-center p-6">
                    <ImagePlus size={36} className="text-[#3C6E47] mb-2" />
                    <p className="text-xs font-bold text-[#2B2420]">Click to capture or upload craft photo</p>
                    <p className="text-[11px] text-[#8A8078] mt-0.5">JPG, PNG, WEBP (stored in backend bucket)</p>
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

            {/* STEP 2: Voice Description Audio */}
            <div className="rounded-3xl border border-[#EDE4D6] bg-white p-5 sm:p-6 card-shadow space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-[#2B2420] flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3C6E47] text-xs font-bold text-white">
                    2
                  </span>
                  Record Audio Story / Description
                </label>
                <div className="flex items-center gap-1.5 text-xs text-[#B5652F] font-semibold">
                  <Languages size={14} />
                  <span>Any Indian Language</span>
                </div>
              </div>

              {/* Language Selector */}
              <div className="flex items-center justify-between gap-3 text-xs bg-[#FFFDF9] border border-[#EDE4D6] p-3 rounded-2xl">
                <span className="font-semibold text-[#2B2420]">Spoken Language:</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="rounded-full border border-[#EDE4D6] bg-white px-3 py-1.5 text-xs font-medium text-[#2B2420] focus:border-[#3C6E47] focus:outline-none"
                >
                  <option value="hi">Hindi (हिंदी)</option>
                  <option value="en">English</option>
                  <option value="bn">Bengali (বাংলা)</option>
                  <option value="te">Telugu (తెలుగు)</option>
                  <option value="ta">Tamil (தமிழ்)</option>
                  <option value="mr">Marathi (मराठी)</option>
                  <option value="gu">Gujarati (ગુજરાતી)</option>
                  <option value="kn">Kannada (ಕನ್ನಡ)</option>
                  <option value="or">Odia (ଓଡ଼ିଆ)</option>
                  <option value="pa">Punjabi (ਪੰਜਾਬੀ)</option>
                </select>
              </div>

              {/* Voice Recorder Widget */}
              <div className="flex items-center justify-between rounded-2xl bg-[#F3E6D3]/40 border border-[#EDE4D6] p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                      isRecording
                        ? "bg-red-500 text-white animate-pulse"
                        : recordingUri
                        ? "bg-[#EBF3EC] text-[#3C6E47]"
                        : "bg-white text-[#3C6E47] shadow-xs"
                    }`}
                  >
                    <Mic size={22} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#2B2420]">
                      {isRecording
                        ? `Recording your voice... (${recordTimer}s)`
                        : recordingUri
                        ? "Audio Description Recorded ✓"
                        : "Tell about the craft in your own words"}
                    </p>
                    <p className="text-[11px] text-[#8A8078]">
                      {isRecording
                        ? "Tap stop when finished speaking"
                        : "Describe the materials, technique, time taken & specialty"}
                    </p>
                  </div>
                </div>

                <div>
                  {isRecording ? (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md transition-all active:scale-95"
                    >
                      <Square size={18} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-[#3C6E47] text-white hover:bg-[#2F5838] shadow-md transition-all active:scale-95"
                    >
                      <Mic size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* Recorded Audio playback */}
              {recordingUri && (
                <div className="flex items-center justify-between rounded-xl bg-[#EBF3EC] px-4 py-2 text-xs font-semibold text-[#3C6E47]">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={togglePlayback}
                      className="p-1 hover:text-[#2F5838]"
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <span>Recorded voice clip ready for pipeline</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeRecording}
                    className="text-[#C77B3E] hover:underline flex items-center gap-1"
                  >
                    <Trash2 size={13} />
                    <span>Re-record</span>
                  </button>
                  {recordingUri !== "simulated-audio" && (
                    <audio
                      ref={audioPlayerRef}
                      src={recordingUri}
                      onEnded={() => setIsPlaying(false)}
                      className="hidden"
                    />
                  )}
                </div>
              )}
            </div>

            {/* STEP 3: Initial Title & Cost Inputs */}
            <div className="rounded-3xl border border-[#EDE4D6] bg-white p-5 sm:p-6 card-shadow space-y-4">
              <label className="text-sm font-bold text-[#2B2420] flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3C6E47] text-xs font-bold text-white">
                  3
                </span>
                Craft Title & Production Costs
              </label>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div>
                  <label className="block font-medium text-[#2B2420] mb-1">
                    Craft Working Title
                  </label>
                  <input
                    type="text"
                    value={initialTitle}
                    onChange={(e) => setInitialTitle(e.target.value)}
                    placeholder="e.g. Khurja Speckled Stoneware Jug"
                    className="w-full rounded-xl border border-[#EDE4D6] px-3.5 py-2.5 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-[#2B2420] mb-1">
                      Craft Discipline / Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-[#EDE4D6] px-3 py-2.5 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none cursor-pointer"
                    >
                      {CRAFT_CATEGORIES.filter((c) => c !== "All Crafts").map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-[#2B2420] mb-1">
                      Material Cost (₹ INR)
                    </label>
                    <input
                      type="number"
                      value={materialCost}
                      onChange={(e) => setMaterialCost(e.target.value)}
                      placeholder="e.g. 350"
                      className="w-full rounded-xl border border-[#EDE4D6] px-3.5 py-2.5 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-[#2B2420] mb-1">
                    Artisan Labour & Time Cost (₹ INR)
                  </label>
                  <input
                    type="number"
                    value={labourCost}
                    onChange={(e) => setLabourCost(e.target.value)}
                    placeholder="e.g. 250"
                    className="w-full rounded-xl border border-[#EDE4D6] px-3.5 py-2.5 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none"
                  />
                </div>
              </div>

              {/* Action: Run AI Pipeline */}
              <button
                type="button"
                disabled={isProcessingPipeline}
                onClick={handleRunPipeline}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#3C6E47] py-3.5 px-6 text-sm font-bold text-white shadow-md transition-all hover:bg-[#2F5838] active:scale-98 disabled:opacity-60 cursor-pointer"
              >
                {isProcessingPipeline ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-[#F5B301]" />
                    <span>Processing with AI Pipeline... (Enhancing & Transcribing)</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} className="text-[#F5B301]" />
                    <span>Process with AI Pipeline & Curate Listing</span>
                  </>
                )}
              </button>

              {pipelineError && (
                <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{pipelineError}</span>
                </div>
              )}
            </div>

            {/* STEP 4: Review & Curate Generated Details (Appears when pipeline completes) */}
            {pipelineFinished && (
              <div className="rounded-3xl border-2 border-[#3C6E47]/40 bg-white p-5 sm:p-6 card-shadow space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-[#EDE4D6] pb-3">
                  <span className="text-sm font-bold text-[#3C6E47] flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-[#3C6E47]" />
                    AI Curated Listing & Pricing Review
                  </span>
                  <span className="text-[11px] font-bold text-[#B5652F] bg-[#F3E6D3] px-2.5 py-0.5 rounded-full">
                    Artisan Margin Protected
                  </span>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <label className="block font-medium text-[#2B2420] mb-1">
                      Curated Product Title (English)
                    </label>
                    <input
                      type="text"
                      value={curatedNameEn}
                      onChange={(e) => setCuratedNameEn(e.target.value)}
                      className="w-full rounded-xl border border-[#EDE4D6] px-3.5 py-2.5 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#2B2420] mb-1">
                      Curated Product Title (Hindi - हिंदी)
                    </label>
                    <input
                      type="text"
                      value={curatedNameHi}
                      onChange={(e) => setCuratedNameHi(e.target.value)}
                      className="w-full rounded-xl border border-[#EDE4D6] px-3.5 py-2.5 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none text-[#3C6E47]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#2B2420] mb-1">
                      Curated Description (English)
                    </label>
                    <textarea
                      rows={3}
                      value={curatedDescEn}
                      onChange={(e) => setCuratedDescEn(e.target.value)}
                      className="w-full rounded-xl border border-[#EDE4D6] px-3.5 py-2 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#2B2420] mb-1">
                      Curated Description (Hindi - हिंदी)
                    </label>
                    <textarea
                      rows={2}
                      value={curatedDescHi}
                      onChange={(e) => setCuratedDescHi(e.target.value)}
                      className="w-full rounded-xl border border-[#EDE4D6] px-3.5 py-2 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none leading-relaxed text-[#3C6E47]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-[#2B2420] mb-1">
                        Detected Materials
                      </label>
                      <input
                        type="text"
                        value={curatedMaterial}
                        onChange={(e) => setCuratedMaterial(e.target.value)}
                        className="w-full rounded-xl border border-[#EDE4D6] px-3 py-2 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#2B2420] mb-1">
                        Available Stock Units
                      </label>
                      <input
                        type="number"
                        value={inStockUnits}
                        onChange={(e) => setInStockUnits(e.target.value)}
                        className="w-full rounded-xl border border-[#EDE4D6] px-3 py-2 text-xs sm:text-sm focus:border-[#3C6E47] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Pricing Breakdown Card */}
                  <div className="rounded-2xl bg-[#F3E6D3]/60 p-4 border border-[#EDE4D6] space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[#2B2420]">
                      <span>AI Pricing Recommendation</span>
                      <span className="text-[#3C6E47] font-extrabold text-sm">
                        Recommended: ₹{pricingBreakdown?.final_price || finalPrice}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[11px] text-[#8A8078] pt-1">
                      <div>Material: ₹{materialCost}</div>
                      <div>Labour: ₹{labourCost}</div>
                      <div>Fair Margin: +{pricingBreakdown?.margin_pct || 35}%</div>
                    </div>
                    <div className="pt-2">
                      <label className="block font-semibold text-[#2B2420] text-xs mb-1">
                        Final Selling Price to List on Marketplace (₹ INR)
                      </label>
                      <input
                        type="number"
                        value={finalPrice}
                        onChange={(e) => setFinalPrice(e.target.value)}
                        className="w-full rounded-xl border border-[#3C6E47] bg-white px-3.5 py-2 font-bold text-[#3C6E47] text-base focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Final Publish Button */}
                  <button
                    type="button"
                    disabled={isPublishing}
                    onClick={handlePublish}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-[#B5652F] py-3.5 px-6 text-sm font-bold text-white shadow-lg hover:bg-[#9B5324] transition-all active:scale-98 disabled:opacity-60 cursor-pointer"
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Publishing to Marketplace...</span>
                      </>
                    ) : (
                      <>
                        <Package size={18} />
                        <span>Publish Craft to Marketplace Catalog</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Marketplace Product Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="sticky top-28">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8A8078]">
                  <img src="/favicon.svg" alt="logo" className="h-6 w-6" />
                  <span className="font-serif-heading font-bold text-sm tracking-wide text-[#2B2420]">
                    Live Store Preview
                  </span>
                </div>
                <span className="text-[10px] font-semibold bg-[#EBF3EC] text-[#3C6E47] px-2.5 py-0.5 rounded-full">
                  Customer View
                </span>
              </div>

              {/* Product Card Styled to DesignDoc.md */}
              <div className="overflow-hidden rounded-3xl border border-[#EDE4D6] bg-white shadow-xl">
                {/* Photo */}
                <div className="relative aspect-4/3 w-full bg-[#F3E6D3] overflow-hidden">
                  <img
                    src={getImageUrl(enhancedImagePath || imagePreview)}
                    alt="Craft item"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-3 left-3 rounded-full bg-[#B5652F] px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
                    New Craft
                  </div>
                  <div className="absolute bottom-3 right-3 rounded-full bg-[#2B2420]/80 backdrop-blur-xs px-3 py-1 text-xs font-bold text-white">
                    ₹{finalPrice} INR
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#8A8078]">
                    <span className="font-bold text-[#B5652F]">
                      {user.store_name || user.name || "Master Artisan"}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <MapPin size={12} /> {user.location || "India"}
                    </span>
                  </div>

                  <h3 className="font-serif-heading text-lg font-bold text-[#2B2420] leading-snug">
                    {curatedNameEn || initialTitle || "Handcrafted Heritage Creation"}
                  </h3>

                  {curatedNameHi && (
                    <p className="text-xs font-medium text-[#3C6E47]">
                      {curatedNameHi}
                    </p>
                  )}

                  <p className="text-xs leading-relaxed text-[#8A8078] line-clamp-3">
                    {curatedDescEn || "Natural handmade materials curated by master artisan."}
                  </p>

                  <div className="rounded-xl bg-[#F3E6D3]/60 p-3 text-[11px] text-[#2B2420]">
                    <strong className="block text-[#3C6E47] font-semibold">Materials & Provenance:</strong>
                    {curatedMaterial || "Locally sourced traditional materials"}
                  </div>

                  {curatedTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {curatedTags.slice(0, 5).map((t, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-[#FFFDF9] border border-[#EDE4D6] px-2.5 py-0.5 text-[10px] font-medium text-[#8A8078]"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      disabled
                      className="w-full rounded-full bg-[#3C6E47] py-2.5 text-xs font-bold text-white opacity-80"
                    >
                      Add to Cart — ₹{finalPrice}
                    </button>
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