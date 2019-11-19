import { relaySchedule } from '../../conf/schedule';
import { BaseSchedule } from '../schedule';
import { Relay } from './relay';

const relay = new Relay();
export const RelaySchedule = new BaseSchedule(relay, relaySchedule);
