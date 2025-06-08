import LoginForm from "./components/login-form"
import Silk from "./components/Silk"
import { TrueFocus } from "./components/title"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="absolute inset-0 z-0" >
        <Silk />
      </div>
      <div className="relative z-10 flex flex-col gap-4 p-6 md:p-10 lg:bg-opacity-5 lg:backdrop-blur-sm  rounded-lg m-4 lg:m-0">
        <div className="flex justify-center gap-2 md:justify-start">
          <TrueFocus 
            sentence="Building the future of"
            manualMode={true}
            blurAmount={5}
            borderColor="9C8CF2"
            glowColor="rgba(0, 255, 0, 0.6)"
            animationDuration={1}
            pauseBetweenAnimations={1}
            />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>

    </div>
  )
}
