import { AquanodePage } from './app.po';

describe('aquanode App', () => {
	let page: AquanodePage;

	beforeEach(() => {
		page = new AquanodePage();
	});

	it('should display message saying app works', () => {
		page.navigateTo();
		expect(page.getParagraphText()).toEqual('app works!');
	});
});
