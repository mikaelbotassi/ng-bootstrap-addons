# Documentação do Componente AutoCompleteLov

## Visão Geral

O `AutoCompleteLov` é um componente Angular que combina funcionalidades de autocompletar e seleção de itens de uma lista de valores (LOV - List of Values). Ele permite que os usuários pesquisem e selecionem itens de forma eficiente, utilizando um campo de entrada com suporte a autocompletar e um modal para exibição de múltiplos resultados.

## Exemplo de Uso

```html
<nba-auto-complete-lov
    [acUrl]="'api/classificacoes-nf3e-itens/getDesc'"
    [acParams]="httpParams"
    [map]="mapConfig"
    [(ngModel)]="selectedValue"
    [disabled]="isDisabled"
    [required]="isRequired">
</nba-auto-complete-lov>
```

## Propriedades

### Inputs

- **`@Input() acUrl: string`**  
  URL da API para busca de valores.

- **`@Input() acParams: HttpParams`**  
  Parâmetros adicionais para a requisição HTTP.

- **`@Input() map: acMap`**  
  Configuração de mapeamento para os campos de código, descrição e valores adicionais.

- **`@Input() disabled: boolean`**  
  Desativa o componente quando definido como `true`.

- **`@Input() required: boolean`**  
  Define o campo como obrigatório quando definido como `true`.

### Outputs

- **`@Output() onPerformed: EventEmitter<'autocomplete' | 'lov'>`**  
  Emite um evento indicando se a busca foi realizada via autocompletar ou LOV.

## Métodos Públicos

- **`fetchLov(desc?: string | null): void`**  
  Realiza a busca de valores no modo LOV (modal).

- **`fetchDesc(code: string | number): void`**  
  Realiza a busca de descrição com base no código fornecido.

- **`selectItem(item: any): void`**  
  Seleciona um item da lista de valores.

## Configuração do Mapeamento

O mapeamento define como os dados retornados pela API serão utilizados no componente.

```typescript
mapConfig: acMap = {
  code: { key: 'cdClassificacaoNf3e', title: 'Código' },
  desc: { key: 'dsClassificacaoNf3e', title: 'Descrição' },
  addons: [
    { key: 'additionalField', title: 'Campo Adicional', setValue: (value) => this.additionalField = value }
  ]
};
```

### Estrutura do `acMap`

- **`code`**: Define o campo que representa o código do item.
- **`desc`**: Define o campo que representa a descrição do item.
- **`addons`** (opcional): Define campos adicionais que podem ser configurados.

## Exemplo de Configuração

### Configuração de Parâmetros HTTP

```typescript
httpParams = new HttpParams().set('filter', 'active');
```

### Configuração do Componente

```typescript
selectedValue: string | number | null = null;
isDisabled: boolean = false;
isRequired: boolean = true;
```

## Detalhes de Implementação

- **Autocompletar**: O componente realiza buscas dinâmicas enquanto o usuário digita no campo de entrada.
- **Modal LOV**: Quando múltiplos resultados são encontrados, o componente exibe um modal para seleção de itens.
- **Validação**: Integra-se com o Angular Forms para validação de campos obrigatórios e estados de formulário.
- **Eventos**: Emite eventos para informar o componente pai sobre mudanças no estado ou seleção de itens.

## Benefícios

- Combina autocompletar e seleção de itens em um único componente.
- Configuração flexível para atender a diferentes cenários de uso.
- Integração com APIs para busca dinâmica de dados.
- Suporte a validação e estados de formulário do Angular.

## Exemplo Completo

```html
<nba-auto-complete-lov
    [acUrl]="'api/classificacoes-nf3e-itens/getDesc'"
    [acParams]="httpParams"
    [map]="mapConfig"
    [(ngModel)]="selectedValue"
    [disabled]="isDisabled"
    [required]="isRequired"
    (onPerformed)="handlePerformed($event)">
</nba-auto-complete-lov>
```

```typescript
import { HttpParams } from '@angular/common/http';

export class ExampleComponent {
  httpParams = new HttpParams().set('filter', 'active');
  mapConfig = {
    code: { key: 'cdClassificacaoNf3e', title: 'Código' },
    desc: { key: 'dsClassificacaoNf3e', title: 'Descrição' },
    addons: [
      { key: 'additionalField', title: 'Campo Adicional', setValue: (value) => this.additionalField = value }
    ]
  };
  selectedValue: string | number | null = null;
  isDisabled: boolean = false;
  isRequired: boolean = true;

  handlePerformed(event: 'autocomplete' | 'lov') {
    console.log('Busca realizada via:', event);
  }
}
```