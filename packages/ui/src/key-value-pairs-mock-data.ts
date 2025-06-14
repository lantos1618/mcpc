import type { KeyValueData, ContentItemData } from './key-value-pairs-display-mcpc';

export const mockKeyValuePairsSimple: KeyValueData = {
  title: 'User Profile (Simple)',
  items: [
    { key: 'Name', value: 'Jane Doe' },
    { key: 'Email', value: 'jane.doe@example.com' },
    { key: 'Status', value: 'Active' },
  ],
};

export const mockKeyValuePairsMixedContent: KeyValueData = {
  title: 'Document Analysis Details',
  items: [
    { key: 'Document ID', value: 'DOC-XYZ-123' },
    {
      key: 'Processing Log',
      value: [
        'Starting analysis...',
        {
          tool: 'sentiment-analyzer',
          details: { score: 0.75, label: 'positive' },
        },
        'Sentiment analysis complete.',
        'Extracting entities...',
        {
          tool: 'entity-extractor',
          details: { entities: ['AI', 'React', 'Zod'] },
        },
        'Found 3 entities.',
        {
          tool: 'summary-generator',
          // No details for this one, to test optionality
        },
        'Summary generation initiated.',
      ] as ContentItemData[], // Type assertion for clarity
    },
    { key: 'Overall Status', value: 'Processing Complete' },
  ],
};

export const mockKeyValuePairsNoTitle: KeyValueData = {
  items: [
    { key: 'Version', value: '1.2.3' },
    { key: 'Last Updated', value: '2024-07-15' },
  ],
};

export const mockKeyValuePairsWithTextStream: KeyValueData = {
  title: 'Live Feed Update',
  items: [
    {
      key: 'Update Stream',
      value: [
        'System booting up...',
        'Connecting to data source...',
        'Received data packet 1.',
        'Processing packet 1...',
        'Received data packet 2.',
        'Error: Connection timeout during packet 2 processing.',
        {
          tool: 'error-reporter',
          details: { code: 'NET-005', message: 'Timeout while fetching resource' }
        },
        'Attempting to reconnect...',
      ] as ContentItemData[],
    },
  ],
};

export const allMockKeyValueData: KeyValueData[] = [
  mockKeyValuePairsSimple,
  mockKeyValuePairsMixedContent,
  mockKeyValuePairsNoTitle,
  mockKeyValuePairsWithTextStream,
]; 