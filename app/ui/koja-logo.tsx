import { DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import { montserrat } from 'app/ui/fonts';

export default function KojaLogo() {
  return (
    <div
      className={`${montserrat.className} flex flex-row items-center leading-none text-white`}
    >
      {/* <DevicePhoneMobileIcon className="h-12 w-12 rotate-[15deg]" /> */}
      <p className="text-[44px]">Koja</p>
    </div>
  );
}
