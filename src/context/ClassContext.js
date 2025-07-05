import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../services/firebase';

const ClassContext = createContext();

export const useClasses = () => {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error('useClasses deve ser usado dentro de ClassProvider');
  }
  return context;
};

export const ClassProvider = ({ children }) => {
  const [classes, setClasses] = useState([]);
  const [activeClass, setActiveClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // Criar nova classe
  const createClass = React.useCallback(async (classData) => {
    if (!currentUser) return;

    try {
      const classesRef = collection(db, 'users', currentUser.uid, 'classes');
      
      // Se esta é a primeira classe ou é marcada como padrão, 
      // remover isDefault das outras
      if (classData.isDefault || classes.length === 0) {
        await Promise.all(
          classes.map(async (cls) => {
            if (cls.isDefault) {
              const classRef = doc(db, 'users', currentUser.uid, 'classes', cls.id);
              await updateDoc(classRef, { isDefault: false });
            }
          })
        );
        classData.isDefault = true;
      }

      const docRef = await addDoc(classesRef, {
        ...classData,
        createdAt: new Date(),
        isActive: true
      });

      const newClass = { id: docRef.id, ...classData };
      
      // Se é a primeira classe ou padrão, definir como ativa
      if (classes.length === 0 || classData.isDefault) {
        setActiveClass(newClass);
      }

      return newClass;
    } catch (error) {
      console.error('Erro ao criar classe:', error);
      setError(error);
      throw error;
    }
  }, [currentUser, classes]);

  // Criar classe padrão
  const createDefaultClass = React.useCallback(async () => {
    try {
      const defaultClassData = {
        name: 'Contabilidade Geral',
        description: 'Controle financeiro pessoal',
        color: '#2E7D32',
        icon: 'home',
        budget: null,
        isDefault: true,
        isActive: true,
        createdAt: new Date()
      };

      await createClass(defaultClassData);
    } catch (error) {
      console.error('Erro ao criar classe padrão:', error);
    }
  }, [createClass]);

  // Carregar classes do usuário
  useEffect(() => {
    if (!currentUser) {
      setClasses([]);
      setActiveClass(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const classesRef = collection(db, 'users', currentUser.uid, 'classes');
    const q = query(classesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const classesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setClasses(classesData);

        // Se não há classe ativa e existem classes, selecionar a padrão ou primeira
        if (!activeClass && classesData.length > 0) {
          const defaultClass = classesData.find(c => c.isDefault) || classesData[0];
          setActiveClass(defaultClass);
        }

        // Se não há classes, criar uma padrão
        if (classesData.length === 0) {
          createDefaultClass();
        }

        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Erro ao carregar classes:', error);
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, activeClass, createDefaultClass]);

  // Atualizar classe
  const updateClass = async (classId, updates) => {
    if (!currentUser) return;

    try {
      const classRef = doc(db, 'users', currentUser.uid, 'classes', classId);
      
      // Se está definindo como padrão, remover de outras
      if (updates.isDefault) {
        await Promise.all(
          classes.map(async (cls) => {
            if (cls.id !== classId && cls.isDefault) {
              const otherClassRef = doc(db, 'users', currentUser.uid, 'classes', cls.id);
              await updateDoc(otherClassRef, { isDefault: false });
            }
          })
        );
      }

      await updateDoc(classRef, {
        ...updates,
        updatedAt: new Date()
      });

      // Atualizar classe ativa se necessário
      if (activeClass && activeClass.id === classId) {
        setActiveClass(prev => ({ ...prev, ...updates }));
      }

    } catch (error) {
      console.error('Erro ao atualizar classe:', error);
      setError(error);
      throw error;
    }
  };

  // Deletar classe
  const deleteClass = async (classId) => {
    if (!currentUser) return;

    try {
      // Não permitir deletar se é a única classe
      if (classes.length <= 1) {
        throw new Error('Não é possível deletar a única classe existente');
      }

      const classRef = doc(db, 'users', currentUser.uid, 'classes', classId);
      await deleteDoc(classRef);

      // Se a classe deletada era a ativa, selecionar outra
      if (activeClass && activeClass.id === classId) {
        const remainingClasses = classes.filter(c => c.id !== classId);
        const newActiveClass = remainingClasses.find(c => c.isDefault) || remainingClasses[0];
        setActiveClass(newActiveClass);
      }

    } catch (error) {
      console.error('Erro ao deletar classe:', error);
      setError(error);
      throw error;
    }
  };

  // Definir classe padrão
  const setDefaultClass = async (classId) => {
    try {
      // Remover isDefault de todas as classes
      await Promise.all(
        classes.map(async (cls) => {
          const classRef = doc(db, 'users', currentUser.uid, 'classes', cls.id);
          await updateDoc(classRef, { 
            isDefault: cls.id === classId 
          });
        })
      );
    } catch (error) {
      console.error('Erro ao definir classe padrão:', error);
      setError(error);
      throw error;
    }
  };

  // Alternar classe ativa
  const switchActiveClass = (classData) => {
    setActiveClass(classData);
    // Salvar preferência no localStorage
    localStorage.setItem('activeClassId', classData.id);
  };

  const value = {
    classes,
    activeClass,
    loading,
    error,
    createClass,
    updateClass,
    deleteClass,
    setDefaultClass,
    switchActiveClass,
    setActiveClass
  };

  return (
    <ClassContext.Provider value={value}>
      {children}
    </ClassContext.Provider>
  );
};
