import figlet from 'figlet';
import boxen from 'boxen';
import chalk from 'chalk';
import { colors } from './theme';

export const displayLogo = () => {
  const logo = figlet.textSync(
    'WithU CLI',

    {
      verticalLayout: 'fitted',
      font: 'ANSI Shadow',
      width: 100,
      horizontalLayout: 'default',
    },
  );
  const logoBox = boxen(logo, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    float: 'center',
    dimBorder: false,
    title: 'create-wu-app',
    titleAlignment: 'center',

    borderColor: colors.primary,
    backgroundColor: colors.background,
  });
  console.log(chalk.hex(colors.primary)(logoBox));
};
