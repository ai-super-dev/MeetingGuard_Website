import Image from "next/image";
import { ZoomIcon } from "@/components/icons/brand";
import { icons } from "@/lib/assets";
import { StatusBar } from "./Device";
import { SCREEN_H, SCREEN_W } from "./geometry";

/** One ring of the alarm: the bell shakes, then rests. */
const RING = "2.4s";

/**
 * The 15-minute meeting alarm, laid out at SCREEN_W×SCREEN_H CSS px and
 * projected into the hero phone, so the ringing bell shares the phone's tilt.
 */
export function AlertScreen() {
  return (
    <div
      className="relative overflow-hidden rounded-[48px] bg-[#0a0a0d] text-center text-white"
      style={{ width: SCREEN_W, height: SCREEN_H }}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(70%_42%_at_50%_34%,rgba(255,40,70,0.22),transparent_70%),linear-gradient(180deg,#101016_0%,#0a0a0d_60%)]"
      />
      <StatusBar className="relative px-[34px] pt-[20px]" />

      {/* ringing bell */}
      <div className="absolute top-[150px] left-1/2 h-[250px] w-[250px] -translate-x-1/2">
        <span
          aria-hidden
          className="absolute inset-[6%] rounded-full bg-[radial-gradient(closest-side,rgba(255,40,70,0.55),rgba(255,40,70,0.12)_60%,transparent)]"
          style={{ animation: `bell-glow ${RING} ease-in-out infinite` }}
        />
        <Image
          src={icons.bell}
          alt=""
          sizes="260px"
          preload
          className="relative h-full w-full origin-[50%_14%] object-contain"
          style={{ animation: `bell-vibrate ${RING} linear infinite` }}
        />
      </div>

      <p className="absolute inset-x-0 top-[438px] text-[36px] leading-tight font-semibold tracking-[-0.01em]">
        Investor call
      </p>
      <p className="absolute inset-x-0 top-[488px] text-[22px] text-white/55">Starts in 15 minutes</p>

      {/* meeting platform */}
      <div className="absolute inset-x-0 top-[552px] flex items-center justify-center gap-[10px]">
        <ZoomIcon className="h-[40px] w-[40px]" />
        <span className="text-[34px] leading-none font-bold tracking-[-0.02em] text-[#2D8CFF]">zoom</span>
      </div>

      {/* Join now: neon gradient outline */}
      <div className="absolute inset-x-[34px] top-[640px] rounded-[20px] bg-[linear-gradient(90deg,#3ee8ff,#7a7bff_55%,#e15bff)] p-[2.5px] shadow-[0_0_24px_rgba(90,160,255,0.45),0_0_40px_rgba(200,90,255,0.25)]">
        <div className="flex h-[66px] items-center justify-center rounded-[18px] bg-[#0c0c12] text-[23px] font-semibold">
          Join now
        </div>
      </div>

      <span className="absolute bottom-[12px] left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-white/85" />
    </div>
  );
}
