%%{init: { 'theme':'neutral', 'themeVariables': { 'primaryColor': '#E8F1F8', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#F7FBFF'}}}%%
flowchart TD
  classDef palefill fill:#E8F1F8,stroke:#D0E3F2,color:#232323;
  classDef box stroke:#C6D9E9,stroke-width:1px,fill:#F7FBFF,color:#232323;

  subgraph Frontend [Angular Frontend]
    A[Angular App]:::palefill
  end

  subgraph Realtime [SignalR Layer]
    H[CollaborationHub]:::box
    
    %% Routing Logic nested here for vertical clarity
    M{Message Logic}:::palefill
    MB[Project Broadcast]:::box
    MD[Direct Message]:::box
  end

  subgraph ApiLayer [ProjectManagement.Api]
    C2[SignalR Hubs]:::box
    C3[Task/Notification Service]:::box
  end

  subgraph CoreLayer [ProjectManagement.Core]
    D[Domain & Interfaces]:::palefill
    E[Business Logic]:::palefill
  end

  subgraph InfraLayer [ProjectManagement.Infrastructure]
    F[AppDbContext]:::box
  end

  G[(SQLite DB)]:::box

  %% Connections
  A --> H
  H --> M
  
  M -- ProjectId --> MB
  M -- ReceiverId --> MD
  
  MB & MD --> C2
  C2 --> C3
  C3 --> D
  D --> F
  F --> G

  class A,H,C2,C3,D,E,F,G,M,MB,MD palefill
  