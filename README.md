# 💨 Fart Sound Generator

A playful web application that generates realistic synthesized fart sounds using Web Audio API and Tone.js. Control various parameters to create the perfect toot!

## 🎵 Features

- **Interactive Sound Generation**: Click the "Generate Fart" button to create custom fart sounds
- **5 Control Parameters**:
  - **Length** (0.1-3.0s): Duration of the sound
  - **Force** (1-10): Intensity and aggression
  - **Wetness** (0-10): Bubbly, sputtering texture
  - **Loudness** (0-100%): Volume level
  - **Pitch** (50-300 Hz): Base frequency
- **Surprise Me**: Randomizes all parameters with weighted distribution
- **Real-time Feedback**: Visual display of current parameter values
- **Responsive Design**: Works on mobile and desktop devices
- **Smooth Animations**: Polished UI with hover effects and transitions

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for Tone.js CDN)

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Click the "Generate Fart" button (user interaction required for audio)

### File Structure

```
project/
├── index.html      # Main HTML structure
├── styles.css      # Styling and responsive design
├── script.js       # Audio engine and UI logic
└── README.md       # This file
```

## 🎨 How It Works

### Audio Synthesis

The application uses Tone.js to create multi-layered synthesized sounds:

1. **Base Tone**: MembraneSynth provides the main body of the sound
2. **FM Synthesis**: Creates vibrato and rumbling effects controlled by Force
3. **Noise Component**: Brown noise filtered through bandpass for wetness/texture
4. **Effects Chain**:
   - Distortion (controlled by Force)
   - Low-pass filter with sweep
   - Compressor for smooth output
   - Master volume control

### Parameter Mapping

- **Length**: Direct mapping to sound duration
- **Force**: Controls FM modulation depth (50-350 Hz) and distortion (0.1-1.0)
- **Wetness**: Controls noise amplitude and burst frequency (0-20 bursts/sec)
- **Loudness**: Logarithmic mapping from 0-100% to -40dB to 0dB
- **Pitch**: Direct mapping to base frequency in Hz

### Surprise Me Algorithm

Uses weighted randomization with triple-averaging to favor mid-range values, creating more realistic and varied sounds while avoiding extreme combinations.

## 🎯 Usage Tips

- **Dry, Short**: Low length, low wetness, mid-high pitch → Quick, airy sound
- **Wet, Long**: High length, high wetness, low pitch → Bubbly, extended sound
- **Powerful**: High force, mid-high loudness → Aggressive, intense sound
- **Subtle**: Low force, low loudness, high pitch → Gentle, quiet sound
- **Surprise Me**: Let the algorithm create random combinations for variety

## 🛠️ Technical Details

### Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid, Flexbox, gradients
- **JavaScript (ES6+)**: Arrow functions, async/await, template literals
- **Tone.js v14.8.49**: Web Audio API framework for synthesis

### Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS requires user interaction)
- Opera: ✅ Full support

### Audio Context Requirements

Due to browser autoplay policies, audio context initialization requires user interaction. The first click on "Generate Fart" or "Surprise Me" will start the audio context.

## 🎮 Controls Reference

| Control  | Range     | Default | Effect              |
| -------- | --------- | ------- | ------------------- |
| Length   | 0.1-3.0s  | 1.0s    | Sound duration      |
| Force    | 1-10      | 5       | Intensity/vibration |
| Wetness  | 0-10      | 3       | Texture/bubbliness  |
| Loudness | 0-100%    | 70%     | Volume level        |
| Pitch    | 50-300 Hz | 150Hz   | Base frequency      |

## 🐛 Troubleshooting

### No Sound Playing

1. Check browser volume and mute settings
2. Try clicking "Generate Fart" again (first click initializes audio)
3. Check browser console for errors
4. Ensure JavaScript is enabled

### Distorted Sound

- Lower the Loudness slider
- Reduce Force parameter
- Check system volume isn't too high

### Mobile Issues

- iOS: Tap the button (autoplay restrictions)
- Android: Ensure browser permissions allow audio
- Check device volume and silent mode

## 📱 Mobile Support

The application is fully responsive and works on mobile devices:

- Touch-friendly controls
- Optimized layout for small screens
- Supports both portrait and landscape orientations
- Handles mobile browser audio restrictions

## 🔧 Customization

### Modify Default Values

Edit the `value` attributes in `index.html`:

```html
<input type="range" id="lengthSlider" ... value="1.0" />
```

### Adjust Sound Synthesis

Modify parameter mapping functions in `script.js`:

```javascript
function forceToModulation(sliderValue) {
    // Adjust these values to change sound characteristics
    return {
        fmDepth: 50 + (force * 30),
        fmFrequency: 3 + (force * 2),
        ...
    };
}
```

### Change Color Scheme

Update CSS custom properties in `styles.css`:

```css
:root {
  --primary-color: #6366f1;
  --secondary-color: #10b981;
  ...;
}
```

## 📝 License

This project is open source and available for educational and entertainment purposes.

## 🤝 Contributing

Feel free to fork, modify, and improve this project! Some ideas:

- Add preset buttons ("Tiny Toot", "Thunder Clap", etc.)
- Implement audio visualization
- Add recording/download functionality
- Create a sequence mode for multiple sounds
- URL parameter support for sharing settings

## 🎉 Credits

- Built with [Tone.js](https://tonejs.github.io/) by Yotam Mann
- Inspired by the science of synthesis and juvenile humor

## ⚠️ Disclaimer

This application is intended for educational and entertainment purposes. Use responsibly and considerately! 💨

---

**Enjoy creating the perfect synthesized toot! 🎵💨**
