export default function getSchema() {
  return{$schema: "https://api.atlassian.com/jsm/assets/imports/external/schema/versions/2021_09_15",
  schema: {
    objectSchema: {
      name: "Dragonball Z",
      description: "DbZ",
      objectTypes: [
        {
          externalId: "object-type/characters",
          name: "Characters",
          description: "A hard drive found during scanning",
          attributes: [
            {
              externalId: "object-type-attribute/c-id",
              name: "ID",
              description: "Identifier",
              type: "integer"
            },
            {
              externalId: "object-type-attribute/c-name",
              name: "Name",
              description: "Name of the character",
              type: "text",
              "label": true
            },
            {
              externalId: "object-type-attribute/c-ki",
              name: "Ki",
              description: "Ki of the character",
              type: "text"
            },
            {
              externalId: "object-type-attribute/c-maxKi",
              name: "maxKi",
              description: "MaxKi of the character",
              type: "text"
            },
            {
              externalId: "object-type-attribute/c-race",
              name: "Race",
              description: "Race of the character",
              type: "text"
            },
            {
              externalId: "object-type-attribute/c-affiliation",
              name: "Affiliation",
              description: "Affiliation of the character",
              type: "text"
            }
          ],
        },
        {
          externalId: "object-type/planets",
          name: "Planets",
          description: "A planet found during scanning",
          attributes: [
            {
              externalId: "object-type-attribute/p-id",
              name: "ID",
              description: "Identifier",
              type: "integer"
            },
            {
              externalId: "object-type-attribute/p-name",
              name: "Name",
              description: "Name of the planet",
              type: "text",
              "label": true
            },
            {
              externalId: "object-type-attribute/p-isDestroyed",
              name: "Is Destroyed",
              description: "Is the planet destroyed?",
              type: "boolean"
            },
            {
              externalId: "object-type-attribute/p-description",
              name: "Description",
              description: "Description of the planet",
              type: "text"
            }
          ]
        }
      ]
    }
  },
  mapping: {
    objectTypeMappings: [
      {
        objectTypeExternalId: "object-type/characters",
        objectTypeName: "Characters",
        selector: "characters",
        description: "Maps characters found in Dragonball Z",
        attributesMapping: [
          {
            attributeExternalId: "object-type-attribute/c-id",
            attributeName: "Id",
            attributeLocators: [
              "id"
            ],
            externalIdPart: true
          },
          {
            attributeExternalId: "object-type-attribute/c-name",
            attributeName: "Name",
            attributeLocators: [
              "name"
            ]
          },
          {
            attributeExternalId: "object-type-attribute/c-ki",
            attributeName: "Ki",
            attributeLocators: [
              "ki"
            ]
          },
          {
            attributeExternalId: "object-type-attribute/c-maxKi",
            attributeName: "Max Ki",
            attributeLocators: [
              "maxKi"
            ]
          },
          {
            attributeExternalId: "object-type-attribute/c-race",
            attributeName: "Race",
            attributeLocators: [
              "race"
            ]
          }
          ,
          {
            attributeExternalId: "object-type-attribute/c-affiliation",
            attributeName: "Affiliation",
            attributeLocators: [
              "affiliation"
            ]
          }
        ]
      },
      {
        objectTypeExternalId: "object-type/planets",
        objectTypeName: "Planets",
        selector: "planets",
        description: "Maps planets found in Dragonball Z",
        attributesMapping: [
          {
            attributeExternalId: "object-type-attribute/p-id",
            attributeName: "Id",
            attributeLocators: [
              "id"
            ],
            externalIdPart: true
          },
          {
            attributeExternalId: "object-type-attribute/p-name",
            attributeName: "Name",
            attributeLocators: [
              "name"
            ]
          },
          {
            attributeExternalId: "object-type-attribute/p-isDestroyed",
            attributeName: "Is Destroyed",
            attributeLocators: [
              "isDestroyed"
            ]
          },
          {
            attributeExternalId: "object-type-attribute/p-description",
            attributeName: "Description",
            attributeLocators: [
              "description"
            ]
          }
        ]
      }
    ]
  }}
}
