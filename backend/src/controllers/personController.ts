import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../utils/prisma';

export const getAllPersons = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const persons = await prisma.person.findMany({
      where: { userId },
      include: {
        medicalConditions: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json(persons);
  } catch (error) {
    console.error('Error en getAllPersons:', error);
    res.status(500).json({ error: 'Error al obtener personas' });
  }
};

export const getPersonById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const person = await prisma.person.findFirst({
      where: { id, userId },
      include: {
        medicalConditions: true,
        father: true,
        mother: true,
        childrenAsFather: true,  // Hijos donde esta persona es el padre
        childrenAsMother: true,  // Hijos donde esta persona es la madre
      },
    });

    if (!person) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }

    res.json(person);
  } catch (error) {
    console.error('Error en getPersonById:', error);
    res.status(500).json({ error: 'Error al obtener persona' });
  }
};

export const createPerson = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { firstName, lastName, birthDate, deathDate, gender, fatherId, motherId, notes } = req.body;

    // Validar campos requeridos
    if (!firstName || !lastName || !gender) {
      return res.status(400).json({ error: 'Nombre, apellido y género son requeridos' });
    }

    // Validar que padre y madre pertenezcan al usuario
    if (fatherId) {
      const father = await prisma.person.findFirst({ where: { id: fatherId, userId } });
      if (!father) {
        return res.status(400).json({ error: 'Padre no válido' });
      }
    }

    if (motherId) {
      const mother = await prisma.person.findFirst({ where: { id: motherId, userId } });
      if (!mother) {
        return res.status(400).json({ error: 'Madre no válida' });
      }
    }

    const person = await prisma.person.create({
      data: {
        firstName,
        lastName,
        birthDate: birthDate ? new Date(birthDate) : null,
        deathDate: deathDate ? new Date(deathDate) : null,
        gender,
        fatherId: fatherId || null,
        motherId: motherId || null,
        notes,
        userId,
      },
      include: {
        medicalConditions: true,
      },
    });

    res.status(201).json(person);
  } catch (error) {
    console.error('Error en createPerson:', error);
    res.status(500).json({ error: 'Error al crear persona' });
  }
};

export const updatePerson = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const { firstName, lastName, birthDate, deathDate, gender, fatherId, motherId, notes } = req.body;

    // Verificar que la persona pertenece al usuario
    const existingPerson = await prisma.person.findFirst({ where: { id, userId } });
    if (!existingPerson) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }

    // Validar padre y madre si se proporcionan
    if (fatherId && fatherId !== '') {
      const father = await prisma.person.findFirst({ where: { id: fatherId, userId } });
      if (!father) {
        return res.status(400).json({ error: 'Padre no válido' });
      }
    }

    if (motherId && motherId !== '') {
      const mother = await prisma.person.findFirst({ where: { id: motherId, userId } });
      if (!mother) {
        return res.status(400).json({ error: 'Madre no válida' });
      }
    }

    const person = await prisma.person.update({
      where: { id },
      data: {
        firstName,
        lastName,
        birthDate: birthDate ? new Date(birthDate) : null,
        deathDate: deathDate ? new Date(deathDate) : null,
        gender,
        fatherId: fatherId || null,
        motherId: motherId || null,
        notes,
      },
      include: {
        medicalConditions: true,
      },
    });

    res.json(person);
  } catch (error) {
    console.error('Error en updatePerson:', error);
    res.status(500).json({ error: 'Error al actualizar persona' });
  }
};

export const deletePerson = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    // Verificar que la persona pertenece al usuario
    const person = await prisma.person.findFirst({ where: { id, userId } });
    if (!person) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }

    await prisma.person.delete({ where: { id } });

    res.json({ message: 'Persona eliminada correctamente' });
  } catch (error) {
    console.error('Error en deletePerson:', error);
    res.status(500).json({ error: 'Error al eliminar persona' });
  }
};