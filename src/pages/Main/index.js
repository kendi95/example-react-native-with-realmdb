import React, {useCallback, useEffect, useState} from 'react';
import {Keyboard} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Repository from '../../components/Repository';
import api from '../../services/api';
import getRealm from '../../services/realm';
import {Container, Form, Input, List, Submit, Title} from './styles';

export default function Main() {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [repositories, setRepositories] = useState([]);

  const handleRefreshRepository = useCallback(
    async repository => {
      const {data} = await api.get(`/repos/${repository.fullName}`);
      const dataRepository = await saveRepository(data);
      setRepositories(
        repositories.map(repo =>
          repo.id === dataRepository.id ? dataRepository : repo,
        ),
      );
    },
    [repositories, saveRepository],
  );

  const saveRepository = useCallback(async repository => {
    const data = {
      id: repository.id,
      name: repository.name,
      fullName: repository.full_name,
      description: repository.description,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
    };

    const realm = await getRealm();
    realm.write(() => {
      realm.create('Repository', data, 'modifield');
    });

    return data;
  }, []);

  const handleAddRepository = useCallback(async () => {
    try {
      const {data} = await api.get(`/repos/${input}`);
      saveRepository(data);
      setInput('');
      setError(false);
      Keyboard.dismiss();
    } catch (err) {
      console.log(err);
      setError(true);
    }
  }, [input, saveRepository]);

  useEffect(() => {
    async function loadRepository() {
      const realm = await getRealm();

      const data = realm.objects('Repository').sorted('stars', true);
      setRepositories(data);
    }

    loadRepository();
  }, []);

  return (
    <Container>
      <Title>Repositórios</Title>
      <Form>
        <Input
          error={error}
          value={input}
          onChangeText={setInput}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Procurar repositório..."
        />
        <Submit onPress={() => handleAddRepository()}>
          <Icon name="add" size={22} color="#fff" />
        </Submit>
      </Form>

      <List
        keyboardShouldPersistTaps="handled"
        data={repositories}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => (
          <Repository item={item} onRefresh={() => handleRefreshRepository()} />
        )}
      />
    </Container>
  );
}
