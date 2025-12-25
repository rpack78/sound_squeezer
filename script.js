// ====================================
// FART SOUND GENERATOR - SCRIPT.JS
// ====================================

// ====================================
// STATE MANAGEMENT
// ====================================
let isPlaying = false;
let isToneStarted = false;
let currentSynths = [];

// ====================================
// DOM ELEMENT REFERENCES
// ====================================
const elements = {
  generateBtn: document.getElementById("generateBtn"),
  surpriseBtn: document.getElementById("surpriseBtn"),
  btnText: document.querySelector(".btn-text"),
  btnPlaying: document.querySelector(".btn-playing"),

  // Sliders
  lengthSlider: document.getElementById("lengthSlider"),
  forceSlider: document.getElementById("forceSlider"),
  wetnessSlider: document.getElementById("wetnessSlider"),
  loudnessSlider: document.getElementById("loudnessSlider"),
  pitchSlider: document.getElementById("pitchSlider"),

  // Value Displays
  lengthValue: document.getElementById("lengthValue"),
  forceValue: document.getElementById("forceValue"),
  wetnessValue: document.getElementById("wetnessValue"),
  loudnessValue: document.getElementById("loudnessValue"),
  pitchValue: document.getElementById("pitchValue"),
};

// ====================================
// INITIALIZATION
// ====================================
document.addEventListener("DOMContentLoaded", () => {
  initializeSliders();
  initializeEventListeners();
});

// ====================================
// SLIDER INITIALIZATION
// ====================================
function initializeSliders() {
  // Update all slider value displays on load
  updateSliderDisplay("length", elements.lengthSlider.value);
  updateSliderDisplay("force", elements.forceSlider.value);
  updateSliderDisplay("wetness", elements.wetnessSlider.value);
  updateSliderDisplay("loudness", elements.loudnessSlider.value);
  updateSliderDisplay("pitch", elements.pitchSlider.value);

  // Update slider backgrounds to show progress
  updateSliderBackground(elements.lengthSlider);
  updateSliderBackground(elements.forceSlider);
  updateSliderBackground(elements.wetnessSlider);
  updateSliderBackground(elements.loudnessSlider);
  updateSliderBackground(elements.pitchSlider);
}

// ====================================
// EVENT LISTENERS
// ====================================
function initializeEventListeners() {
  // Generate button
  elements.generateBtn.addEventListener("click", handleGenerate);

  // Surprise Me button
  elements.surpriseBtn.addEventListener("click", handleSurpriseMe);

  // Slider input events
  elements.lengthSlider.addEventListener("input", (e) => {
    updateSliderDisplay("length", e.target.value);
    updateSliderBackground(e.target);
  });

  elements.forceSlider.addEventListener("input", (e) => {
    updateSliderDisplay("force", e.target.value);
    updateSliderBackground(e.target);
  });

  elements.wetnessSlider.addEventListener("input", (e) => {
    updateSliderDisplay("wetness", e.target.value);
    updateSliderBackground(e.target);
  });

  elements.loudnessSlider.addEventListener("input", (e) => {
    updateSliderDisplay("loudness", e.target.value);
    updateSliderBackground(e.target);
  });

  elements.pitchSlider.addEventListener("input", (e) => {
    updateSliderDisplay("pitch", e.target.value);
    updateSliderBackground(e.target);
  });
}

// ====================================
// UI UPDATE FUNCTIONS
// ====================================
function updateSliderDisplay(type, value) {
  const numValue = parseFloat(value);

  switch (type) {
    case "length":
      elements.lengthValue.textContent = `${numValue.toFixed(1)}s`;
      break;
    case "force":
      elements.forceValue.textContent = Math.round(numValue);
      break;
    case "wetness":
      elements.wetnessValue.textContent = Math.round(numValue);
      break;
    case "loudness":
      elements.loudnessValue.textContent = `${Math.round(numValue)}%`;
      break;
    case "pitch":
      elements.pitchValue.textContent = `${Math.round(numValue)}Hz`;
      break;
  }
}

function updateSliderBackground(slider) {
  const value = slider.value;
  const min = slider.min || 0;
  const max = slider.max || 100;
  const percentage = ((value - min) / (max - min)) * 100;

  slider.style.background = `linear-gradient(to right, #6366f1 0%, #6366f1 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`;
}

function setPlayingState(playing) {
  isPlaying = playing;
  elements.generateBtn.disabled = playing;
  elements.surpriseBtn.disabled = playing;

  if (playing) {
    elements.btnText.style.display = "none";
    elements.btnPlaying.style.display = "inline";
  } else {
    elements.btnText.style.display = "inline";
    elements.btnPlaying.style.display = "none";
  }
}

// ====================================
// PARAMETER MAPPING FUNCTIONS
// ====================================

/**
 * Convert length slider value to seconds
 */
function lengthToSeconds(sliderValue) {
  return parseFloat(sliderValue);
}

/**
 * Map force to FM modulation depth and distortion amount
 * Returns object with modulation depth and distortion
 */
function forceToModulation(sliderValue) {
  const force = parseInt(sliderValue);
  return {
    fmDepth: 50 + force * 30, // 50-350 Hz modulation depth
    fmFrequency: 3 + force * 2, // 3-23 Hz modulation rate
    distortion: force * 0.1, // 0.1-1.0 distortion amount
    envelopeMultiplier: 0.5 + force * 0.05, // Affects envelope sharpness
  };
}

/**
 * Map wetness to noise parameters
 * Returns object with noise amplitude and burst characteristics
 */
function wetnessToNoise(sliderValue) {
  const wetness = parseInt(sliderValue);
  return {
    noiseAmplitude: wetness * 0.015, // 0-0.15 noise level
    burstFrequency: wetness * 2, // 0-20 bursts per second
    burstCount: Math.floor(wetness * 1.5), // 0-15 total bursts
    filterFrequency: 800 + wetness * 200, // 800-2800 Hz bandpass
  };
}

/**
 * Map loudness percentage to decibels
 */
function loudnessToVolume(sliderValue) {
  const loudness = parseInt(sliderValue);
  if (loudness === 0) return -Infinity;
  // Map 0-100% to -40dB to 0dB (logarithmic scale)
  return -40 + loudness * 0.4;
}

/**
 * Map pitch slider to base frequency in Hz
 */
function pitchToFrequency(sliderValue) {
  return parseInt(sliderValue);
}

// ====================================
// AUDIO ENGINE - TONE.JS
// ====================================

/**
 * Initialize Tone.js audio context (required for browser autoplay policies)
 */
async function initializeTone() {
  if (!isToneStarted) {
    await Tone.start();
    isToneStarted = true;
    console.log("Tone.js audio context started");
  }
}

/**
 * Clean up all active synths and effects
 */
function cleanupSynths() {
  currentSynths.forEach((synth) => {
    try {
      synth.dispose();
    } catch (e) {
      console.warn("Error disposing synth:", e);
    }
  });
  currentSynths = [];
}

/**
 * Main sound generation function
 */
async function generateFartSound() {
  // Ensure Tone.js is initialized
  await initializeTone();

  // Get current parameter values
  const params = getCurrentParameters();

  // Clean up any existing synths
  cleanupSynths();

  // Create the sound components
  const soundComponents = createSoundComponents(params);
  currentSynths = soundComponents.synths;

  // Set playing state
  setPlayingState(true);

  // Schedule the sound playback
  const now = Tone.now();
  playSoundComponents(soundComponents, params, now);

  // Schedule cleanup after sound completes
  setTimeout(() => {
    setPlayingState(false);
    cleanupSynths();
  }, params.length * 1000 + 100);
}

/**
 * Get current parameters from sliders
 */
function getCurrentParameters() {
  const length = lengthToSeconds(elements.lengthSlider.value);
  const force = forceToModulation(elements.forceSlider.value);
  const wetness = wetnessToNoise(elements.wetnessSlider.value);
  const volume = loudnessToVolume(elements.loudnessSlider.value);
  const pitch = pitchToFrequency(elements.pitchSlider.value);

  return { length, force, wetness, volume, pitch };
}

/**
 * Create all sound components (synths, noise, effects)
 */
function createSoundComponents(params) {
  const synths = [];

  // Create master volume control
  const masterVolume = new Tone.Volume(params.volume).toDestination();
  synths.push(masterVolume);

  // Create distortion effect (controlled by force)
  const distortion = new Tone.Distortion(params.force.distortion).connect(
    masterVolume
  );
  synths.push(distortion);

  // Create compressor to smooth output
  const compressor = new Tone.Compressor(-30, 3).connect(distortion);
  synths.push(compressor);

  // Create low-pass filter
  const filter = new Tone.Filter({
    type: "lowpass",
    frequency: 800 + params.pitch * 2,
    rolloff: -24,
  }).connect(compressor);
  synths.push(filter);

  // 1. BASE TONE - Main body of the sound using MembraneSynth
  const baseSynth = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 6,
    oscillator: { type: "sine" },
    envelope: {
      attack: 0.01,
      decay: params.length * 0.3,
      sustain: 0.3,
      release: params.length * 0.3,
    },
  }).connect(filter);
  synths.push(baseSynth);

  // 2. FM SYNTH - Creates the vibrato/rumbling effect
  const fmSynth = new Tone.FMSynth({
    harmonicity: 2,
    modulationIndex: params.force.fmDepth / 10,
    oscillator: { type: "sine" },
    envelope: {
      attack: 0.02,
      decay: params.length * 0.4,
      sustain: 0.2,
      release: params.length * 0.3,
    },
    modulation: { type: "square" },
    modulationEnvelope: {
      attack: 0.01,
      decay: params.length * 0.2,
      sustain: 0.5,
      release: params.length * 0.2,
    },
  }).connect(filter);
  synths.push(fmSynth);

  // 3. NOISE COMPONENT - Creates wetness/texture
  let noise = null;
  let noiseFilter = null;

  if (params.wetness.noiseAmplitude > 0) {
    // Create bandpass filter for noise
    noiseFilter = new Tone.Filter({
      type: "bandpass",
      frequency: params.wetness.filterFrequency,
      Q: 2,
    }).connect(compressor);
    synths.push(noiseFilter);

    // Create brown noise source
    noise = new Tone.Noise({
      type: "brown",
      volume: -20 + params.wetness.noiseAmplitude * 100,
    }).connect(noiseFilter);
    synths.push(noise);
  }

  return {
    synths,
    baseSynth,
    fmSynth,
    noise,
    filter,
  };
}

/**
 * Play all sound components with proper timing
 */
function playSoundComponents(components, params, startTime) {
  const { baseSynth, fmSynth, noise } = components;

  // Play base tone
  baseSynth.triggerAttackRelease(params.pitch, params.length, startTime);

  // Play FM synth (slightly lower pitch for richness)
  fmSynth.triggerAttackRelease(params.pitch * 0.75, params.length, startTime);

  // Play noise bursts for wetness
  if (noise && params.wetness.burstCount > 0) {
    noise.start(startTime);

    // Create random bursts throughout the duration
    const burstDuration = 0.05; // 50ms bursts
    const timeStep = params.length / (params.wetness.burstCount + 1);

    for (let i = 0; i < params.wetness.burstCount; i++) {
      const burstTime =
        startTime + timeStep * (i + 1) + (Math.random() * 0.1 - 0.05);
      const burstLength = burstDuration * (0.5 + Math.random() * 0.5);

      // Schedule noise bursts with volume automation
      noise.volume.setValueAtTime(-20, burstTime);
      noise.volume.linearRampToValueAtTime(
        -10 + params.wetness.noiseAmplitude * 50,
        burstTime + 0.01
      );
      noise.volume.linearRampToValueAtTime(-40, burstTime + burstLength);
    }

    noise.stop(startTime + params.length);
  }

  // Add subtle filter sweep for realism
  const filterSweepAmount = params.force.fmDepth * 2;
  components.filter.frequency.setValueAtTime(
    components.filter.frequency.value,
    startTime
  );
  components.filter.frequency.linearRampToValueAtTime(
    components.filter.frequency.value + filterSweepAmount,
    startTime + params.length * 0.3
  );
  components.filter.frequency.linearRampToValueAtTime(
    components.filter.frequency.value,
    startTime + params.length
  );
}

// ====================================
// EVENT HANDLERS
// ====================================

/**
 * Handle Generate Fart button click
 */
async function handleGenerate() {
  if (isPlaying) return;

  try {
    await generateFartSound();
  } catch (error) {
    console.error("Error generating fart sound:", error);
    alert("Sorry, there was an error generating the sound. Please try again.");
    setPlayingState(false);
  }
}

/**
 * Handle Surprise Me button click
 */
function handleSurpriseMe() {
  if (isPlaying) return;

  // Generate weighted random values (favor mid-range)
  const randomLength = weightedRandom(0.1, 3.0, 0.5, 2.0);
  const randomForce = weightedRandomInt(1, 10, 3, 7);
  const randomWetness = weightedRandomInt(0, 10, 2, 6);
  const randomLoudness = weightedRandomInt(0, 100, 50, 90);
  const randomPitch = weightedRandomInt(50, 300, 100, 200);

  // Update sliders
  elements.lengthSlider.value = randomLength.toFixed(1);
  elements.forceSlider.value = randomForce;
  elements.wetnessSlider.value = randomWetness;
  elements.loudnessSlider.value = randomLoudness;
  elements.pitchSlider.value = randomPitch;

  // Update displays
  updateSliderDisplay("length", randomLength);
  updateSliderDisplay("force", randomForce);
  updateSliderDisplay("wetness", randomWetness);
  updateSliderDisplay("loudness", randomLoudness);
  updateSliderDisplay("pitch", randomPitch);

  // Update backgrounds
  updateSliderBackground(elements.lengthSlider);
  updateSliderBackground(elements.forceSlider);
  updateSliderBackground(elements.wetnessSlider);
  updateSliderBackground(elements.loudnessSlider);
  updateSliderBackground(elements.pitchSlider);

  // Automatically play the sound
  setTimeout(() => handleGenerate(), 300);
}

// ====================================
// UTILITY FUNCTIONS
// ====================================

/**
 * Generate weighted random number (favors mid-range)
 */
function weightedRandom(min, max, favorMin, favorMax) {
  const random1 = Math.random();
  const random2 = Math.random();
  const random3 = Math.random();

  // Average of three random numbers creates bell curve distribution
  const avg = (random1 + random2 + random3) / 3;

  // Map to range with favor zone
  const range = max - min;
  const favorRange = favorMax - favorMin;
  const favorStart = (favorMin - min) / range;
  const favorEnd = (favorMax - min) / range;

  // Bias towards favor zone
  let value;
  if (avg < favorStart) {
    value = min + (avg / favorStart) * (favorMin - min);
  } else if (avg > favorEnd) {
    value = favorMax + ((avg - favorEnd) / (1 - favorEnd)) * (max - favorMax);
  } else {
    value =
      favorMin + ((avg - favorStart) / (favorEnd - favorStart)) * favorRange;
  }

  return Math.max(min, Math.min(max, value));
}

/**
 * Generate weighted random integer
 */
function weightedRandomInt(min, max, favorMin, favorMax) {
  return Math.round(weightedRandom(min, max, favorMin, favorMax));
}

// ====================================
// ERROR HANDLING & CLEANUP
// ====================================

// Clean up synths when page unloads
window.addEventListener("beforeunload", () => {
  cleanupSynths();
});

// Handle visibility change (pause if tab is hidden)
document.addEventListener("visibilitychange", () => {
  if (document.hidden && isPlaying) {
    // Could pause audio here if needed
    console.log("Tab hidden while playing");
  }
});

console.log("🎵 Fart Sound Generator initialized!");
