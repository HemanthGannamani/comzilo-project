import React from 'react';
import { Avatar, AvatarProps } from '@mui/material';

interface UserAvatarProps extends Omit<AvatarProps, 'src'> {
  src?: string | null;
  firstName?: string;
  lastName?: string;
  size?: number;
  border?: string;
  bgColor?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  firstName = 'Abhay',
  lastName = 'Ram',
  size = 40,
  border = '2px solid #60A5FA',
  bgColor = '#2563EB',
  sx,
  ...rest
}) => {
  // Sanitize src to ensure only valid URLs are passed
  const isValidSrc =
    src &&
    typeof src === 'string' &&
    src.trim() !== '' &&
    src !== 'null' &&
    src !== 'undefined' &&
    !src.includes('undefined') &&
    !src.includes('null');

  const firstLetter = (firstName?.[0] || 'A').toUpperCase();
  const lastLetter = (lastName?.[0] || 'R').toUpperCase();
  const initials = `${firstLetter}${lastLetter}`;

  if (isValidSrc) {
    return (
      <Avatar
        src={src}
        imgProps={{ style: { objectFit: 'cover' } }}
        sx={{
          width: size,
          height: size,
          bgcolor: bgColor,
          color: '#FFFFFF',
          fontSize: `${Math.round(size * 0.4)}px`,
          fontWeight: 800,
          border: border,
          ...sx,
        }}
        {...rest}
      >
        {initials}
      </Avatar>
    );
  }

  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        bgcolor: bgColor,
        color: '#FFFFFF',
        fontSize: `${Math.round(size * 0.4)}px`,
        fontWeight: 800,
        border: border,
        ...sx,
      }}
      {...rest}
    >
      {initials}
    </Avatar>
  );
};
