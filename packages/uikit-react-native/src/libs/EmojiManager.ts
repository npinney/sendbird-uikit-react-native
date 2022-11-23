import type { Emoji, EmojiCategory, EmojiContainer } from '@sendbird/chat';
import type { LocalCacheStorage } from '@sendbird/uikit-react-native';

import InternalLocalCacheStorage from './InternalLocalCacheStorage';

class MemoryStorage implements LocalCacheStorage {
  _data: Record<string, string> = {};

  async getAllKeys(): Promise<readonly string[] | string[]> {
    return Object.keys(this._data);
  }

  async getItem(key: string): Promise<string | null> {
    return this._data[key];
  }

  async removeItem(key: string): Promise<void> {
    delete this._data[key];
  }

  async setItem(key: string, value: string): Promise<void> {
    this._data[key] = value;
  }
}

class EmojiManager {
  static key = 'sendbird-uikit@emoji-manager';

  constructor(
    private internalStorage: InternalLocalCacheStorage = new InternalLocalCacheStorage(new MemoryStorage()),
  ) {}

  private emojiStorage = {
    data: null as null | EmojiContainer,
    get: async () => {
      if (!this.emojiStorage.data) {
        const strItem = await this.internalStorage.getItem(EmojiManager.key);
        if (strItem) this.emojiStorage.data = Object.freeze(JSON.parse(strItem));
      }
      return this.emojiStorage.data;
    },
    set: async (data: EmojiContainer) => {
      this.emojiStorage.data = Object.freeze(data);
      await this.internalStorage.setItem(EmojiManager.key, JSON.stringify(data));
    },
  };

  public _emojiCategoryMap: Record<string, EmojiCategory> = {};
  get emojiCategoryMap() {
    return this._emojiCategoryMap;
  }

  public _allEmojiMap: Record<string, Emoji> = {};
  get allEmojiMap() {
    return this._allEmojiMap;
  }

  public _allEmoji: Emoji[] = [];
  get allEmoji() {
    return this._allEmoji;
  }

  public init = async (emojiContainer?: EmojiContainer) => {
    if (emojiContainer) await this.emojiStorage.set(emojiContainer);

    const container = await this.emojiStorage.get();

    if (container) {
      for (const category of container.emojiCategories) {
        this._emojiCategoryMap[category.id] = category;
        for (const emoji of category.emojis) {
          this._allEmojiMap[emoji.key] = emoji;
        }
      }
      this._allEmoji = Object.values(this._allEmojiMap);
    }
  };
}

export default EmojiManager;
