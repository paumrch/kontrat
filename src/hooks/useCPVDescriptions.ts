import { useState, useEffect } from 'react';
import { getCPVInfo, CPVInfo } from '@/utils/cpv';

export function useCPVDescriptions(cpvCodes: string[]) {
  const [cpvDescriptions, setCPVDescriptions] = useState<Map<string, CPVInfo>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCPVDescriptions = async () => {
      if (cpvCodes.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Obtener únicos códigos CPV y limpiarlos
        const uniqueCodes = [...new Set(cpvCodes)].filter(code => code && code.trim());
        
        if (uniqueCodes.length === 0) {
          setLoading(false);
          return;
        }

        // Cargar descripciones en paralelo con límite de concurrencia
        const batchSize = 5; // Procesar 5 a la vez para no sobrecargar
        const results = new Map<string, CPVInfo>();
        
        for (let i = 0; i < uniqueCodes.length; i += batchSize) {
          const batch = uniqueCodes.slice(i, i + batchSize);
          const batchPromises = batch.map(async (code) => {
            try {
              const cpvInfo = await getCPVInfo(code);
              return { code, cpvInfo };
            } catch (error) {
              console.warn(`Error cargando CPV ${code}:`, error);
              return { 
                code, 
                cpvInfo: { 
                  code, 
                  description: 'Error al cargar descripción' 
                } as CPVInfo 
              };
            }
          });

          const batchResults = await Promise.all(batchPromises);
          batchResults.forEach(({ code, cpvInfo }) => {
            results.set(code, cpvInfo);
          });
        }

        setCPVDescriptions(results);
      } catch (error) {
        console.error('Error cargando descripciones CPV:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCPVDescriptions();
  }, [cpvCodes]);

  return { cpvDescriptions, loading };
}