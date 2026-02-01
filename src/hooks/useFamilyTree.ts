// src/hooks/useFamilyTree.ts
import { useState, useEffect, useCallback } from 'react';
import { Node, Edge, useNodesState, useEdgesState } from 'reactflow';
import { Person } from '../types';
import { familyTreeService } from '../services/familyTreeService';

export function useFamilyTree() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    loadFamilyTree();
  }, []);

  const loadFamilyTree = async () => {
    const data = await familyTreeService.getAll();
    setPersons(data);
    
    // Convertir personas a nodos y edges
    const { nodes, edges } = convertToReactFlow(data);
    setNodes(nodes);
    setEdges(edges);
  };

  const convertToReactFlow = (persons: Person[]) => {
    const nodes: Node[] = persons.map((person, index) => ({
      id: person.id,
      type: 'person',
      position: calculatePosition(person, index, persons),
      data: { person },
    }));

    const edges: Edge[] = [];
    persons.forEach(person => {
      if (person.fatherId) {
        edges.push({
          id: `${person.fatherId}-${person.id}`,
          source: person.fatherId,
          target: person.id,
          type: 'smoothstep',
        });
      }
      if (person.motherId) {
        edges.push({
          id: `${person.motherId}-${person.id}`,
          source: person.motherId,
          target: person.id,
          type: 'smoothstep',
        });
      }
    });

    return { nodes, edges };
  };

  const calculatePosition = (person: Person, index: number, all: Person[]) => {
    // Algoritmo simple de layout por generaciones
    const generation = getGeneration(person, all);
    const siblingsInGeneration = all.filter(p => getGeneration(p, all) === generation);
    const indexInGeneration = siblingsInGeneration.indexOf(person);
    
    return {
      x: indexInGeneration * 250,
      y: generation * 200,
    };
  };

  const getGeneration = (person: Person, all: Person[]): number => {
    if (!person.fatherId && !person.motherId) return 0;
    
    const father = all.find(p => p.id === person.fatherId);
    const mother = all.find(p => p.id === person.motherId);
    
    const fatherGen = father ? getGeneration(father, all) : -1;
    const motherGen = mother ? getGeneration(mother, all) : -1;
    
    return Math.max(fatherGen, motherGen) + 1;
  };

  return {
    persons,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    loadFamilyTree,
  };
}