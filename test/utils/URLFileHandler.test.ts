import fs from 'fs';
import { URLFileHandler } from '../../src/utils/URLFileHandler';
import { URLHandler } from '../../src/utils/URLHandler';

// Mock the fs module
jest.mock('fs');

// Mock the URLHandler class
jest.mock('../../src/utils/URLHandler', () => {
  return {
    URLHandler: jest.fn().mockImplementation(() => {
      return {
        setRepoURL: jest.fn().mockResolvedValue(undefined),
        getRepoURL: jest.fn().mockResolvedValue('https://github.com/user/repo')
      };
    }),
    isValidURL: jest.fn()
  };
});

describe('URLFileHandler', () => {
  describe('isTxtFile', () => {
    it('should return true for .txt files', () => {
      expect(URLFileHandler.isTxtFile('file.txt')).toBe(true);
    });

    it('should return false for non-.txt files', () => {
      expect(URLFileHandler.isTxtFile('file.pdf')).toBe(false);
    });
  });

  describe('getGithubUrlsFromFile', () => {
    let filePath: string;
    let data: string;

    beforeEach(() => {
      filePath = 'file.txt';
      data = 'https://github.com/user/repo\nhttps://github.com/user/repo2';

      (fs.readFile as unknown as jest.Mock<any, any>).mockImplementation((filePath, encoding, callback) => {
        if(filePath === 'file.txt') {
          return data;
        }
        else if(filePath === 'invalid.txt') {
          return 'invalid-url';
        }
        throw new Error('Invalid file');
      });

    });

    it('should return null for an invalid file', async () => {
      const urls = await URLFileHandler.getGithubUrlsFromFile('invalid.file');
      expect(urls).toBe(null);
    });
  });
});