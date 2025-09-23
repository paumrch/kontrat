-- Esquema de base de datos para Kontrat
-- Ejecutar estos comandos en el SQL Editor de Supabase

-- Crear tabla de contratos
CREATE TABLE contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('draft', 'active', 'completed', 'cancelled')) DEFAULT 'draft',
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Crear tabla de proyectos
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) CHECK (status IN ('planning', 'in_progress', 'completed', 'on_hold')) DEFAULT 'planning',
  budget DECIMAL(10,2) NOT NULL,
  deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Crear tabla de documentos
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(20) CHECK (type IN ('contract', 'invoice', 'proposal', 'report', 'other')) NOT NULL,
  file_path VARCHAR(500),
  size INTEGER NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_contracts_user_id ON contracts(user_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_contract_id ON documents(contract_id);
CREATE INDEX idx_documents_project_id ON documents(project_id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad - los usuarios solo pueden ver sus propios datos
CREATE POLICY "Users can view own contracts" ON contracts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contracts" ON contracts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contracts" ON contracts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own contracts" ON contracts
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own documents" ON documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" ON documents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents" ON documents
  FOR DELETE USING (auth.uid() = user_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos de ejemplo (opcional)
-- Nota: Reemplaza 'USER_ID_AQUI' con el ID real de un usuario de auth.users
/*
INSERT INTO contracts (title, description, client_name, amount, status, start_date, end_date, user_id) VALUES
('Desarrollo Web Completo', 'Creación de sitio web corporativo con panel de administración', 'Empresa ABC S.L.', 15000.00, 'active', '2024-01-15', '2024-06-15', 'USER_ID_AQUI'),
('Aplicación Mobile iOS', 'Desarrollo de app nativa para iOS con integración de APIs', 'StartupXYZ', 25000.00, 'completed', '2023-09-01', '2023-12-20', 'USER_ID_AQUI'),
('Consultoría Técnica', 'Auditoría y optimización de infraestructura cloud', 'TechCorp Internacional', 8500.00, 'draft', '2024-03-01', NULL, 'USER_ID_AQUI');

INSERT INTO projects (name, description, status, budget, deadline, user_id) VALUES
('E-commerce Platform', 'Plataforma de comercio electrónico con gestión de inventario', 'in_progress', 45000.00, '2024-08-30', 'USER_ID_AQUI'),
('Sistema CRM', 'Customer Relationship Management con automatización', 'planning', 32000.00, '2024-12-15', 'USER_ID_AQUI'),
('Analytics Dashboard', 'Panel de análisis en tiempo real con visualizaciones avanzadas', 'completed', 18000.00, '2024-01-30', 'USER_ID_AQUI');
*/