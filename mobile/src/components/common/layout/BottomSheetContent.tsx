import { DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import * as DialogPrimitive from '@rn-primitives/dialog';
import { View } from "react-native";

export default function BottomSheetContent(props: any) {
  return (
    <DialogPortal>
        <DialogOverlay className="items-stretch justify-end p-0">
            <View className="w-full bg-card p-5 rounded-t-3xl border border-border">
                <DialogPrimitive.Content className=" w-full p-0" {...props}/>
            </View>
        </DialogOverlay>
    </DialogPortal>
  )
}