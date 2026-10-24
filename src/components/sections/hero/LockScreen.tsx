import Image from "next/image";
import { ChevronRight, Flashlight, Camera, Lock } from "lucide-react";
import { icons } from "@/lib/assets";
import { SCREEN_H, SCREEN_W } from "./geometry";

function StatusIcons() {
  return (
    <svg viewBox="0 0 54 12" className="h-[11px] w-auto" aria-hidden>
      <g fill="#fff">
        <rect x="0" y="8" width="2.6" height="4" rx="0.6" />
        <rect x="4" y="6" width="2.6" height="6" rx="0.6" />
        <rect x="8" y="3.5" width="2.6" height="8.5" rx="0.6" />
        <rect x="12" y="1" width="2.6" height="11" rx="0.6" />
        <path d="M24 3.2a8.6 8.6 0 0 1 6.2 2.5l-1.3 1.3a6.8 6.8 0 0 0-9.8 0l-1.3-1.3A8.6 8.6 0 0 1 24 3.2zm0 3.6a5 5 0 0 1 3.6 1.5L24 12l-3.6-3.7A5 5 0 0 1 24 6.8z" />
        <rect x="35" y="2" width="16" height="9" rx="2.4" fill="none" stroke="#fff" strokeOpacity="0.6" />
        <rect x="36.6" y="3.6" width="12.4" height="5.8" rx="1.3" />
        <rect x="52" y="5" width="1.6" height="3.4" rx="0.8" fillOpacity="0.6" />
      </g>
    </svg>
  );
}

/**
 * The lock screen shown inside the phone, laid out at SCREEN_W×SCREEN_H CSS
 * px and projected into the frame's opening by PhoneMockup.
 */
export function LockScreen() {
  return (
    <div
      className="relative overflow-hidden rounded-[46px] text-white"
      style={{
        width: SCREEN_W,
        height: SCREEN_H,
        background:
          "radial-gradient(60% 34% at 50% 40%, rgba(255,40,90,0.32), transparent 70%), radial-gradient(90% 40% at 50% 100%, rgba(150,70,255,0.55), transparent 70%), radial-gradient(70% 40% at 10% 0%, rgba(50,90,255,0.35), transparent 70%), linear-gradient(180deg, #0c1446 0%, #151a5c 42%, #22186e 72%, #3a1d8c 100%)",
      }}
    >
      {/* status bar */}
      <div className="absolute inset-x-0 top-[18px] flex items-center justify-between px-[36px] text-[16px] font-semibold">
        <span>9:41</span>
        <StatusIcons />
      </div>

      {/* lock + clock + date */}
      <Lock className="absolute top-[72px] left-1/2 h-[28px] w-[28px] -translate-x-1/2" strokeWidth={2.4} aria-hidden />
      <p className="absolute inset-x-0 top-[108px] text-center text-[96px] leading-none font-light tracking-[-0.01em] text-white/95">
        9:41
      </p>
      <p className="absolute inset-x-0 top-[212px] text-center text-[23px] font-medium text-white/90">Friday, 12 September</p>

      {/* ringing bell */}
      <div className="absolute top-[196px] left-1/2 h-[252px] w-[252px] -translate-x-1/2">
        <span
          aria-hidden
          className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(255,45,90,0.65)_0%,rgba(255,30,80,0.2)_45%,transparent_70%)]"
          style={{ animation: "lock-glow 1.6s ease-in-out infinite" }}
        />
        <Image
          src={icons.phoneBell}
          alt=""
          sizes="200px"
          className="relative h-full w-full origin-[50%_22%] object-contain"
          style={{ animation: "lock-ring 2.4s ease-in-out infinite" }}
        />
      </div>

      {/* notification */}
      <div
        className="absolute inset-x-[14px] top-[440px] h-[162px] rounded-[30px] border border-white/15 bg-[linear-gradient(160deg,rgba(120,130,230,0.32),rgba(60,60,170,0.22))] px-[22px] pt-[20px] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_10px_30px_rgba(10,10,60,0.35)]"
        style={{ animation: "lock-notify 0.9s cubic-bezier(0.22,1,0.36,1) 1.2s both" }}
      >
        <div className="flex items-center gap-[8px]">
          <Image src={icons.app} alt="" sizes="40px" className="h-[30px] w-[30px] object-contain" />
          <span className="text-[20px] font-medium text-white/90">MeetingGuard</span>
          <span className="ml-auto text-[17px] text-white/55">now</span>
        </div>
        <p className="mt-[12px] text-[29px] leading-tight font-bold">Investor Call</p>
        <p className="mt-[4px] text-[23px] text-white/80">Starts in 15 minutes</p>
      </div>

      {/* slide to join */}
      <div className="absolute inset-x-[30px] top-[628px] flex h-[100px] items-center overflow-hidden rounded-full border border-[#a98bff]/40 bg-[linear-gradient(90deg,rgba(80,70,200,0.55),rgba(110,60,210,0.35))] shadow-[0_0_24px_rgba(140,90,255,0.45),inset_0_1px_0_rgba(255,255,255,0.12)]">
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-1/3 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)]"
          style={{ animation: "hero-sweep 3.6s ease-in-out 2s infinite" }}
        />
        <span
          className="relative z-10 ml-[11px] grid h-[78px] w-[78px] place-items-center rounded-full bg-white shadow-[0_0_20px_rgba(160,140,255,0.9)]"
          style={{ animation: "lock-knob 3.6s cubic-bezier(0.45,0,0.2,1) 2s infinite" }}
        >
          <ChevronRight className="h-[38px] w-[38px] text-[#4b3bdc]" strokeWidth={3} aria-hidden />
        </span>
        <span className="flex-1 pr-[20px] text-center text-[26px] font-medium">
          slide to{" "}
          <span className="bg-[linear-gradient(90deg,#b28cff,#e48cff)] bg-clip-text text-transparent">join</span>
        </span>
      </div>

      {/* quick actions + home indicator */}
      <span className="absolute top-[750px] left-[30px] grid h-[56px] w-[56px] place-items-center rounded-full bg-white/12">
        <Flashlight className="h-[25px] w-[25px]" aria-hidden />
      </span>
      <span className="absolute top-[750px] right-[30px] grid h-[56px] w-[56px] place-items-center rounded-full bg-white/12">
        <Camera className="h-[25px] w-[25px]" aria-hidden />
      </span>
      <span className="absolute bottom-[16px] left-1/2 h-[6px] w-[150px] -translate-x-1/2 rounded-full bg-white/90" />
    </div>
  );
}
