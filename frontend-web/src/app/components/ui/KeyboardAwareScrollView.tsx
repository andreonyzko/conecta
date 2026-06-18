import React from 'react';
import { Platform } from 'react-native';
import { cssInterop } from 'nativewind';
import { KeyboardAwareScrollView as BaseKeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

cssInterop(BaseKeyboardAwareScrollView, {
  className: 'style',
  contentContainerClassName: 'contentContainerStyle',
});

type Props = React.ComponentProps<typeof BaseKeyboardAwareScrollView> & {
  className?: string;
  contentContainerClassName?: string;
};

export function KeyboardAwareScrollView({
  children,
  extraHeight,
  extraScrollHeight,
  keyboardShouldPersistTaps,
  ...props
}: Props) {
  return (
    <BaseKeyboardAwareScrollView
      enableOnAndroid
      enableAutomaticScroll
      extraHeight={extraHeight ?? 120}
      extraScrollHeight={extraScrollHeight ?? (Platform.OS === 'ios' ? 32 : 88)}
      keyboardOpeningTime={0}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps ?? 'handled'}
      showsVerticalScrollIndicator={false}
      {...props}
    >
      {children}
    </BaseKeyboardAwareScrollView>
  );
}
