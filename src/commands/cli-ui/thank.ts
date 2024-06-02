import figlet from 'figlet';
import boxen from 'boxen';
import { colors } from './theme';

export const displayThanks = () => {
  return thanksBox;
};

const thanks = figlet.textSync(
  'Thank you for using WithU CLI! 🚀, made with ❤️ by the WithU Training Web Team. If you have any feedback or suggestions, please let us know at https://github.com/withutraining/create-wu-app/issues.',

  {
    font: 'ANSI Shadow',
    horizontalLayout: 'default',
    verticalLayout: 'default',
  },
);
const thanksBox = boxen(thanks, {
  padding: 1,
  margin: 1,
  borderStyle: 'round',
  float: 'center',
  dimBorder: false,
  borderColor: colors.primary,
  backgroundColor: colors.secondary,
});
