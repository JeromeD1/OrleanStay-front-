import { CacheBusterPipe } from './cache-buster.pipe';

describe('CacheBusterPipe', () => {
  it('create an instance', () => {
    const pipe = new CacheBusterPipe();
    expect(pipe).toBeTruthy();
  });
});
