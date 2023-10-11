import {
  SetupRecordingInput,
  setupRecording,
} from '@jupiterone/integration-sdk-testing';
export { Recording } from '@jupiterone/integration-sdk-testing';

/**
 * This function is a wrapper around the SDK's setup recording function
 * that redacts the 'api-secret-key' header.
 */
export function setupSlackRecording(input: SetupRecordingInput) {
  return setupRecording({
    ...input,
    mutateEntry: (entry) => {
      redactSlackTokenEntry(entry);
    },
  });
}

function redactSlackTokenEntry(entry): void {
  entry.request.postData.text = 'token=fake-token';
}
