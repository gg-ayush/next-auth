import type React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar"
import { Button } from "@/ui/button"
import { ColorPicker } from "@/components/comp/CustomComponents/ColorPicker"
import { ThemeType } from "@prisma/client"
import { signOut } from "next-auth/react"

interface UserProfileProps {
  user: any // Replace 'any' with your actual user type
  ColorPickerAttrs: {
    handleTextColorChange: (color: string) => void
    textColor: string
    currentBackground: { name: string; class: string }
    setCurrentBackground: (background: { name: string; class: string }) => void
  }
}

const UserProfile: React.FC<UserProfileProps> = ({ user, ColorPickerAttrs }) => {
  const { currentBackground, textColor, handleTextColorChange, setCurrentBackground } = ColorPickerAttrs

  const handleColorChange = (color: string) => {
    const formattedColor = color.startsWith("#") ? color : `#${color}`
    const newBackground = {
      class: `bg-[${formattedColor}]`,
      name: "Custom Color",
    }
    setCurrentBackground(newBackground)
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <Avatar className="w-24 h-24">
        <AvatarImage src={user.image} alt={user.name} />
        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <h2 className="text-2xl font-bold">{user.name}</h2>
      <p className="text-gray-600">{user.email}</p>

      <div className="w-full bg-white bg-opacity-20 rounded-lg p-4 shadow-md">
        <h3 className="font-bold text-lg mb-2">Theme Customization</h3>
        <div className="flex justify-between">
          <div>
            <h4 className="text-sm font-semibold mb-1">Background</h4>
            <ColorPicker
              value={
                currentBackground.name === "Custom Color"
                  ? currentBackground.class.match(/bg-\[(#[0-9A-Fa-f]{6})\]/)?.[1] || ""
                  : ""
              }
              onChange={handleColorChange}
              typeColor={ThemeType.THEME}
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-1">Text Color</h4>
            <ColorPicker value={textColor} onChange={handleTextColorChange} typeColor={ThemeType.TEXT} />
          </div>
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={() => signOut()}>
        Sign Out
      </Button>
    </div>
  )
}

export default UserProfile

