import React from 'react';
import { Text } from 'react-native';

import type { SendbirdMultipleFilesMessage } from '@sendbird/uikit-utils';

import Box from '../../components/Box';
import ImageWithPlaceholder from '../../components/ImageWithPlaceholder';
import PressBox from '../../components/PressBox';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import MessageContainer from './MessageContainer';
import type { GroupChannelMessageProps } from './index';

const ImageMultipleFilesMessage = (props: GroupChannelMessageProps<SendbirdMultipleFilesMessage>) => {
  const { onPress, onLongPress, variant = 'incoming' } = props;

  const { colors } = useUIKitTheme();

  return (
    <MessageContainer {...props}>
      <Text>Data prop of the MultipleFilesMessage: {props.message.data}</Text>
      <Box style={styles.container} backgroundColor={colors.ui.groupChannelMessage[variant].enabled.background}>
        {props.message.fileInfoList.map((file, index) => (
          <PressBox
            activeOpacity={0.8}
            onPress={onPress}
            onLongPress={onLongPress}
            key={file.fileName}
            style={index !== props.message.fileInfoList.length-1 && styles.imageContainer}
          >
            <ImageWithPlaceholder source={{ uri: file.url }} style={styles.image} />
          </PressBox>
        ))}
        {props.children}
      </Box>
    </MessageContainer>
  );
};

const styles = createStyleSheet({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    marginBottom: 4,
  },
  image: {
    maxWidth: 240,
    width: 240,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
  },
});

export default ImageMultipleFilesMessage;
