import { JSX, useState } from 'react';
import { ToggleButton } from '@mui/material';
import { useTheme } from '@repo/utils';
import { DarkMode } from '@mui/icons-material';

export const EasemindToggleButton = (): JSX.Element => {
  const [selected, setSelected] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const iconColor = theme.palette.text.primary;

  return (
    <>
      <ToggleButton
        sx={{ borderRadius: '10rem', padding: '10px' }}
        value="check"
        size={"small"}
        selected={selected}
        aria-label={'Alterar para o modo escuro'} 
        onChange={() => {
          toggleTheme();
          setSelected((prev) => !prev);
        }}
      >
        <DarkMode style={{ color: iconColor }} />
      </ToggleButton>

    </>
  );
};