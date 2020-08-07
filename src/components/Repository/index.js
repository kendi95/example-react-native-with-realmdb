import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Container,
  Description,
  Name,
  Refresh,
  RefreshText,
  Statu,
  StatuCount,
  Status,
} from './styles';

export default function Repository({item, onRefresh}) {
  return (
    <Container>
      <Name>{item.name}</Name>
      <Description>{item.description}</Description>
      <Status>
        <Statu>
          <Icon name="star" size={16} color="#333" />
          <StatuCount>{item.stars}</StatuCount>
        </Statu>
        <Statu>
          <Icon name="code-fork" size={16} color="#333" />
          <StatuCount>{item.forks}</StatuCount>
        </Statu>
      </Status>

      <Refresh onPress={onRefresh}>
        <Icon name="refresh" color="#7159c1" size={16} />
        <RefreshText>ATUALIZAR</RefreshText>
      </Refresh>
    </Container>
  );
}
