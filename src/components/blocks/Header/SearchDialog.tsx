import { Grid, MenuItem, MenuList, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
import InputDialog from './InputDialog';

const Menu: any[] = [
  {
    id: 1,
    name: 'Chat GPT',
  },
  {
    id: 2,
    name: 'Writer',
  },
  {
    id: 3,
    name: 'Summary',
  },
  {
    id: 4,
    name: 'Analyzer',
  },
  {
    id: 5,
    name: 'Collection',
  },
  {
    id: 6,
    name: 'New Year',
  },
  {
    id: 7,
    name: 'Intelligence',
  },
];

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  keyWord: string;
  setKeyWord?: React.Dispatch<React.SetStateAction<string>>;
}

export const SearchDialog: React.FC<Props> = ({ open, setOpen, keyWord, setKeyWord }) => {
  const handleClose = () => {
    setOpen(!open);
  };
  // TODO: const windowWidth = window.innerWidth; doesn't work in SSR
  const [IsSm, setIsSm] = React.useState(false);

  React.useEffect(() => {
    function handleWindowResize() {
      const windowWidth = window.innerWidth;
      setIsSm(windowWidth < 600);
    }

    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <React.Fragment>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        BackdropProps={{ style: { backgroundColor: !IsSm ? 'rgba(0, 0, 0, 0)' : '' } }}
        PaperProps={{
          style: {
            position: 'fixed',
            top: IsSm ? '100px' : '16px',
            left: IsSm ? '7%' : '22%',
            borderRadius: IsSm ? '22px' : '18px',
            boxShadow:
              '0px 9px 11px -5px rgba(0, 0, 0, 0.20), 0px 18px 28px 2px rgba(0, 0, 0, 0.14), 0px 7px 34px 6px rgba(0, 0, 0, 0.12)',
            maxHeight: '591px',
            maxWidth: '960px',
            width: IsSm ? '86%' : '66%',
            zIndex: 999,
            margin: '0px',
            background: 'var(--surface, #FDFBFF)',
          },
        }}
        className="dialog-search"
      >
        <DialogTitle
          sx={{
            padding: '8px 4px',
          }}
        >
          <InputDialog keyWord={keyWord} setOpen={setOpen} setKeyWord={setKeyWord} />
        </DialogTitle>
        <DialogContent>
          <Grid
            sx={{
              display: 'flex',
              padding: '24px 24px 8px 24px',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              alignSelf: 'stretch',
            }}
          >
            <Grid
              sx={{
                color: 'var(--on-background, #1B1B1E)',
                fontSize: '12px',
                fontFamily: 'Poppins',
                fontWeight: 500,
                lineHeight: '22px',
                letterSpacing: '0.46px',
                opacity: 0.75,
              }}
            >
              Popular requests:
            </Grid>
            <Grid
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '8px',
                alignSelf: 'stretch',
              }}
            >
              <Typography
                sx={{
                  color: 'var(--on-surface, #1B1B1E)',
                  fontSize: '11px',
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  lineHeight: '166%',
                  letterSpacing: '0.4px',
                  opacity: 0.5,
                }}
              >
                Search:
              </Typography>

              <Grid
                sx={{
                  borderRadius: '4px',
                  background: 'var(--surface-5, #E1E2EC)',
                  display: 'flex',
                  padding: '0px 0px 2px 0px',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '8px',
                }}
              >
                <Grid
                  sx={{
                    display: 'flex',
                    padding: '2px 4px',
                    alignItems: 'flex-start',
                    borderRadius: '4px',
                    border: '1px solid var(--surface-5, #E1E2EC)',
                    background: 'var(--surface-1, #FDFBFF)',
                  }}
                >
                  <Typography
                    sx={{
                      color: 'var(--on-surface, #1B1B1E)',
                      fontSize: '11px',
                      fontFamily: 'Poppins',
                      fontWeight: 500,
                      lineHeight: '166%',
                      letterSpacing: '0.4px',
                      opacity: 0.5,
                      textTransform: 'uppercase',
                    }}
                  >
                    Enter
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <MenuList autoFocusItem={false} sx={{ width: '100%' }}>
            {Menu.map((el, idx) => (
              <MenuItem
                key={idx}
                onClick={() => {
                  if (!!setKeyWord) setKeyWord(el.name);
                  setOpen(false);
                }}
                sx={{
                  display: 'flex',
                  padding: '16px 24px',
                  alignItems: 'flex-start',
                  gap: '8px',
                  alignSelf: 'stretch',
                  background: el.name === keyWord ? '#8080801a' : 'none',
                }}
              >
                <Typography
                  sx={{
                    color: 'var(--on-background, #1B1B1E)',
                    fontSize: '16px',
                    fontFamily: 'Poppins',
                    fontWeight: 500,
                    lineHeight: '22px',
                    letterSpacing: '0.46px',
                  }}
                >
                  {el.name}
                </Typography>
              </MenuItem>
            ))}
          </MenuList>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};
