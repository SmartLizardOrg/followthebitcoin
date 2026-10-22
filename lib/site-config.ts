// Public, reviewed deployment settings. No secrets belong in this file.
// Leave unavailable destinations null: the UI must never pretend they are live.
export const siteConfig = {
  name: 'Follow the Bitcoin',
  publicOrigin: 'https://followthebitcoin.pages.dev' as string | null,
  repositoryUrl: 'https://github.com/molnard-labs/followthebitcoin' as
    | string
    | null,
  communityUrl:
    'https://github.com/molnard-labs/followthebitcoin/discussions' as
      | string
      | null,
  communityProvider: 'GitHub Discussions',
  onionUrl: null as string | null,
};
