let audioCtx: AudioContext | null = null

/** Call on user gesture (start/pause) so finish chimes are allowed by the browser. */
export function primePomodoroAudio(): void {
  try {
    if (!audioCtx) audioCtx = new AudioContext()
    if (audioCtx.state === 'suspended') void audioCtx.resume()
  } catch {
    // Audio unavailable
  }
}

/** Short ascending chime when a focus or break block ends. */
export function playPomodoroFinishSound(): void {
  try {
    if (!audioCtx) audioCtx = new AudioContext()
    if (audioCtx.state === 'suspended') void audioCtx.resume()

    const now = audioCtx.currentTime
    const notes = [523.25, 659.25, 783.99]

    notes.forEach((freq, i) => {
      const osc = audioCtx!.createOscillator()
      const gain = audioCtx!.createGain()
      osc.connect(gain)
      gain.connect(audioCtx!.destination)
      osc.type = 'sine'
      osc.frequency.value = freq
      const t = now + i * 0.14
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.22, t + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38)
      osc.start(t)
      osc.stop(t + 0.42)
    })
  } catch {
    // Autoplay blocked or unsupported
  }
}
