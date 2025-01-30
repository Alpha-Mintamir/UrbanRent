import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const IdentityVerificationPage = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const photoRef = useRef(null);

  const [step, setStep] = useState(1);
  const [verificationData, setVerificationData] = useState({
    kifleKetema: '',
    wereda: '',
    kebele: '',
    houseNumber: '',
    nationalId: null,
    livePhoto: null,
  });
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Dummy data for dropdowns
  const kifleKetemaOptions = ['አዲስ ከተማ', 'ቂርቆስ', 'ቦሌ', 'የካ', 'አራዳ', 'ልደታ'];
  const weredaOptions = Array.from({ length: 14 }, (_, i) => `ወረዳ ${i + 1}`);
  const kebeleOptions = Array.from({ length: 20 }, (_, i) => `ቀበሌ ${i + 1}`);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVerificationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error('ይቅርታ፣ ካሜራ በዚህ መሳሪያ አይደገፍም');
        return;
      }

      // First try to get all video devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === 'videoinput',
      );

      // Find front camera if it exists
      const frontCamera = videoDevices.find(
        (device) =>
          device.label.toLowerCase().includes('front') ||
          device.label.toLowerCase().includes('user') ||
          device.label.toLowerCase().includes('selfie'),
      );

      const constraints = {
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
          deviceId: frontCamera ? { exact: frontCamera.deviceId } : undefined,
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch((err) => {
            console.error('Video play error:', err);
            toast.error('ቪዲዮ ማጫወት አልተቻለም');
          });
        };
        setIsCameraOpen(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      toast.error('ካሜራ መክፈት አልተቻለም። እባክዎ ካሜራ እንዲጠቀሙ ፈቃድ ይስጡ።');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOpen(false);
    }
  };

  const takeLivePhoto = () => {
    if (videoRef.current && photoRef.current) {
      const context = photoRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, 640, 480);
      const photo = photoRef.current.toDataURL('image/jpeg');
      setVerificationData((prev) => ({
        ...prev,
        livePhoto: photo,
      }));
      stopCamera();
      setStep(4); // Move to next step after taking photo
    }
  };

  const handleNextStep = () => {
    if (
      step === 1 &&
      (!verificationData.kifleKetema ||
        !verificationData.wereda ||
        !verificationData.kebele ||
        !verificationData.houseNumber)
    ) {
      toast.error('እባክዎ ሁሉንም መረጃ ያስገቡ');
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-2 block">ክፍለ ከተማ:</label>
              <select
                name="kifleKetema"
                value={verificationData.kifleKetema}
                onChange={handleInputChange}
                className="my-1 w-full rounded-2xl border px-3 py-2"
              >
                <option value="">ይምረጡ</option>
                {kifleKetemaOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-1">
              <label className="mb-2 block">ወረዳ:</label>
              <select
                name="wereda"
                value={verificationData.wereda}
                onChange={handleInputChange}
                className="my-1 w-full rounded-2xl border px-3 py-2"
              >
                <option value="">ይምረጡ</option>
                {weredaOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-1">
              <label className="mb-2 block">ቀበሌ:</label>
              <select
                name="kebele"
                value={verificationData.kebele}
                onChange={handleInputChange}
                className="my-1 w-full rounded-2xl border px-3 py-2"
              >
                <option value="">ይምረጡ</option>
                {kebeleOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="mb-2 block">የቤት ቁጥር:</label>
              <input
                type="text"
                name="houseNumber"
                value={verificationData.houseNumber}
                onChange={handleInputChange}
                placeholder="የቤት ቁጥር ያስገቡ"
                className="my-1 w-full rounded-2xl border px-3 py-2"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col items-center">
            <h3 className="mb-4 text-xl">የመታወቂያ ካርድ ፎቶ</h3>
            <div className="mb-4 w-full max-w-md rounded-lg border-2 border-dashed border-gray-300 p-8">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setVerificationData((prev) => ({
                        ...prev,
                        nationalId: file,
                      }));
                      handleNextStep();
                    }
                  }}
                  accept="image/*"
                  className="hidden"
                  id="id-upload"
                />
                <label htmlFor="id-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    መታወቂያ ካርድዎን ያስገቡ
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col items-center">
            <h3 className="mb-4 text-xl">የእርስዎ ፎቶ</h3>
            <div className="relative w-full max-w-md">
              {isCameraOpen ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="mirror w-full rounded-lg"
                    style={{
                      maxHeight: '480px',
                      transform: 'scaleX(-1)', // Mirror the video
                    }}
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                    <button
                      onClick={() => stopCamera()}
                      className="rounded-full bg-gray-500 px-4 py-2 text-white"
                    >
                      ካሜራ ዝጋ
                    </button>
                    <button
                      onClick={takeLivePhoto}
                      className="rounded-full bg-[#D746B7] px-4 py-2 text-white"
                    >
                      ፎቶ ያንሱ
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed border-gray-300 p-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <button
                    onClick={startCamera}
                    className="rounded-full bg-[#D746B7] px-6 py-3 text-white"
                  >
                    ካሜራ ክፈት
                  </button>
                </div>
              )}
              <canvas
                ref={photoRef}
                style={{ display: 'none' }}
                width="640"
                height="480"
              />
            </div>
            <p className="mt-4 text-center text-sm text-gray-500">
              እባክዎ ግልፅ የሆነ የፊት ፎቶ ያንሱ
            </p>
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col items-center">
            <h3 className="mb-4 text-xl">ማረጋገጫ</h3>
            <p className="mb-4 text-center">ሁሉም መረጃዎች በትክክል መሞላታቸውን ያረጋግጡ</p>
            <button
              onClick={async () => {
                try {
                  // Add your verification API call here
                  await new Promise((resolve) => setTimeout(resolve, 1500));
                  toast.success('መረጃዎ በተሳካ ሁኔታ ተልኳል!');
                  navigate('/account/places/new');
                } catch (error) {
                  toast.error('የተሳሳተ መረጃ');
                }
              }}
              className="rounded-full bg-[#D746B7] px-6 py-3 text-white"
            >
              አረጋግጥ እና ቀጥል
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mt-4 flex grow items-center justify-around">
      <div className="mb-64 w-full max-w-md">
        <h1 className="mb-8 text-center text-4xl">መረጃ ማረጋገጫ</h1>

        {/* Progress indicator */}
        <div className="mb-8 flex justify-between">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                step >= stepNumber ? 'bg-[#D746B7] text-white' : 'bg-gray-200'
              }`}
            >
              {stepNumber}
            </div>
          ))}
        </div>

        {renderStep()}

        {/* Navigation Buttons - Modified to show Next at every stage */}
        <div className="mt-6 flex justify-between">
          {step > 1 && (
            <button
              onClick={handlePrevStep}
              className="rounded-full bg-gray-500 px-6 py-2 text-white"
            >
              ተመለስ
            </button>
          )}

          {/* Show Next button at every stage */}
          {step < 4 && (
            <button
              onClick={handleNextStep}
              className="ml-auto rounded-full bg-[#D746B7] px-6 py-2 text-white"
            >
              ቀጥል
            </button>
          )}

          {/* Final confirmation button */}
          {step === 4 && (
            <button
              onClick={async () => {
                try {
                  // Simulating API call
                  await new Promise((resolve) => setTimeout(resolve, 1500));
                  toast.success('መረጃዎ በተሳካ ሁኔታ ተልኳል!');
                  navigate('/account/places/new');
                } catch (error) {
                  toast.error('የተሳሳተ መረጃ');
                }
              }}
              className="ml-auto rounded-full bg-[#D746B7] px-6 py-2 text-white"
            >
              አረጋግጥ እና ቀጥል
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdentityVerificationPage;
