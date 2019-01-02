import { lightsSchedule } from '../../conf/schedule';
import { BaseSchedule } from '../schedule';
import { Lights } from './lights';

export const LightsSchedule = new BaseSchedule(Lights, lightsSchedule);
