IF NOT EXISTS (SELECT 1 FROM area_lazer WHERE nome = 'Churrasqueira')
BEGIN
    INSERT INTO area_lazer (nome, capacidade_maxima, precisa_pagamento) VALUES ('Churrasqueira', 15, 1);
    INSERT INTO area_lazer (nome, capacidade_maxima, precisa_pagamento) VALUES ('Hidromassagem', 4, 0);
    INSERT INTO area_lazer (nome, capacidade_maxima, precisa_pagamento) VALUES ('Salão Gourmet', 20, 1);
    INSERT INTO area_lazer (nome, capacidade_maxima, precisa_pagamento) VALUES ('Salão de Festas', 50, 1);
    INSERT INTO area_lazer (nome, capacidade_maxima, precisa_pagamento) VALUES ('Cinema', 10, 0);
END