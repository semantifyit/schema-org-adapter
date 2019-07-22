# Conversion Algorithm

### A.) Load Schema
Load file **schema.jsonld** from directory **data_input**. Store the _@graph_ nodes of the schema in memory for further processing. Every @graph node holds minor information about a specific resource, which is identified by the used **@id**. 

Example _@graph node_ for a Class:
```JSON
{
    "@id": "http://schema.org/ChildrensEvent",
    "@type": "rdfs:Class",
    "rdfs:comment": "Event type: Children's event.",
    "rdfs:label": "ChildrensEvent",
    "rdfs:subClassOf": {
        "@id": "http://schema.org/Event"
    }
}
```

### B.) Classify Input
Classify every _@graph_ node based on its **@type**. The node is transformed to another data-model based on the **@type** and stored in a new memory storage for an easier further usage. This is the first of two steps for an exact classification of the node, since the **@type** is not enough for a correct classification. The mapping of our data model and the **@type(s)** of the corresponding **@graph** nodes are as follows:

- **classes** ("@type" = "rdfs:Class")
- **properties** ("@type" = "rdf:Property")
- **dataTypes** ("@type" = "rdfs:Class" + "http://schema.org/DataType")
- **enumerations** ("@type" = "rdfs:Class")
- **enumerationMembers** ("@type" = @id of enumeration)

Our default approach with _legacy data_, hence data nodes which are superseded by new data nodes, is to discard this legacy data nodes. This can be changed in the code if the user wants the legacy data included in the generated data.

Example _@graph node_ for an Enumeration Instance (enumerationMember):
```JSON
{
  "@id": "http://schema.org/EBook",
  "@type": "http://schema.org/BookFormatType",
  "rdfs:comment": "Book format: Ebook.",
  "rdfs:label": "EBook"
}
```
Example _@graph node_ for an Enumeration:
```JSON
{
  "@id": "http://schema.org/BookFormatType",
  "@type": "rdfs:Class",
  "rdfs:comment": "The publication format of the book.",
  "rdfs:label": "BookFormatType",
  "rdfs:subClassOf": {
    "@id": "http://schema.org/Enumeration"
  }
}
```

Since the _@type_ of **BookFormatType** is **rdfs:Class** this data node is stored in the classes memory instead of the enumerations memory:
```JSON
{
  "name": "BookFormatType",
  "description": "The publication format of the book.",
  "type": "Class",
  "superClasses": [
    "Enumeration"
  ],
  "subClasses": []
}
```

### C.) Classification cleaning
To have a correct classification for our data model it is needed to clean the data generated in the previous step. Inaccurate records include:

- Enumerations which are handled as Classes.
- DataTypes which are handled as Classes.
- Meta classes like **Enumeration** or **DataType**.
 
#### C.1) Extract enumerations from classes memory 
 For each entry in the classes memory check if its _superClasses_ contain **Enumeration**. If this is the case, it is known that this class is an enumeration, so this data entry is transformed and moved to the enumerations memory.
 
 Example data entry in the enumerations memory:
```JSON
{
  "name": "BookFormatType",
  "description": "The publication format of the book.",
  "type": "Enumeration",
  "superClasses": [
    "Enumeration"
  ],
  "subClasses": [],
  "enumerationMembers": []
}
```
 
 Enumerations from the GoodRelations Vocabulary for E-Commerce are problematic, since they do not have the same structure as the other SDO enumerations. Usually enumerations from SDO do not have properties and do not have subclasses. And they have enumeration instances (enumerationMembers) baked in the SDO vocabulary. GoodRelations enumerations do not have instances, instead they provide example URIs for possible values in the description of the enumeration. eg.: http://schema.org/PaymentMethod 
 
 The standard SDO approach and the GoodRelation approach of modelling enumerations are very different and there are arguments to defend any of the two design decisions. However, the fact that both enumeration design models are part of the SDO Core makes it difficult to create tools/algorithms which are aware and specialized around SDO enumerations.
 
#### C.2) Extract dataTypes from classes memory 
 For each entry in the classes memory it is checked if its _superClasses_ is included in the dataTypes memory. If this is the case, it is known that this class is a DataType, so this data entry is transformed and moved to the dataTypes memory.
  
Example data entry in the dataTypes memory:
```JSON
{
  "name": "URL",
  "description": "Data type: URL.",
  "type": "DataType",
  "superClasses": [
    "Text"
  ],
  "subClasses": []
}
```
#### C.3) Delete blacklisted Entries (deactivated)
 Schema.org contains utility entries like the classes Intangible, Enumeration or DataType. While this entries serve to understand the relationship between "things" in the SDO Data model, one may argue that there are entries that won't be needed or do not make sense at all, eg. create an Annotation with the @type "DataType". In this step a function is provided which deletes blacklisted classes. This function can be easily extended to properties, enumerations, etc. However, this step is commented out, so that the user can decide if he wants to use the data in question or not.
### D.) Inheritance
 Schema.org's Inheritance design states if an entity is the superClass/superProperty of another entity. In our data model design we also hold the information if an entity is the subClass/subProperty of another entity. In this step this inheritance information is generated.
 
#### D.1) Add subClasses for Classes and Enumerations
For each entry in the classes memory and enumerations memory the _superClasses_ are checked (if they are in classes memory or enumeration memory) and those super classes add the actual entry in their _subClasses_. Enumerations typically do not have subClasses, but the enumeration design of the GoodRelations Vocabulary breaks this rule, read more in step C.1. 

Example data entry in the classes memory:
 
```JSON
{
  "name": "LodgingBusiness",
  "description": "A lodging business, such as a motel, hotel, or inn.",
  "type": "Class",
  "superClasses": [
    "LocalBusiness"
  ],
  "subClasses": [
    "BedAndBreakfast",
    "Motel",
    "Hotel",
    "Hostel",
    "Resort",
    "Campground"
  ]
}
```

#### D.2) Add subClasses for DataTypes
For each entry in the dataTypes memory the _superClasses_ are checked (if they are in dataTypes memory) and those super types add the actual entry in their _subClasses_.

Example data entry in the dataTypes memory:
```JSON
{
  "name": "Number",
  "description": "Data type: Number.",
  "type": "DataType",
  "superClasses": [],
  "subClasses": [
    "Integer",
    "Float"
  ]
}
```

#### D.3) Add subProperties for Properties
For each entry in the properties memory the _superProperties_ are checked (if they are in properties memory) and those super properties add the actual entry in their _subProperties_.

Example data entry in the properties memory:
```JSON
{
  "name": "about",
  "description": "The subject matter of the content.",
  "type": "Property",
  "superProperties": [],
  "subProperties": [
    "mainEntity"
  ],
  "domainClasses": [
    "CreativeWork",
    "CommunicateAction",
    "Event"
  ],
  "valueTypes": [
    "Thing"
  ]
}
```
 
### E.) Relationships
In this step additional fields are added to certain data entries to add links to other data entries, which should make it easier to use the generated data set. 
  
#### E.1) Add properties to classes
For each entry in the classes memory the _properties_ field is added. This data field holds all properties which belong to this class (class is domain for property). The data field is filled in step E.3.
 
Example data entry in the classes memory:
```JSON
{
   "name": "LodgingBusiness",
   "description": "A lodging business, such as a motel, hotel, or inn.",
   "type": "Class",
   "superClasses": [
     "LocalBusiness"
   ],
   "subClasses": [
     "BedAndBreakfast",
     "Motel",
     "Hotel",
     "Hostel",
     "Resort",
     "Campground"
   ],
   "properties": []
}
```
  
#### E.2) Add enumerationMembers and properties to enumerations
For each entry in the enumerations memory the _enumerationMembers_ and the _properties_ field are added. This data field holds all enumerationMembers which belong to this enumeration (enumerationMember is instance of this enumeration). The enumerationMembers for classes which are not enumerations (eg. Organizations) are skipped.
   
Example data entry in the enumerations memory:
```JSON
{
  "name": "PaymentStatusType",
  "description": examples,
  "type": "Enumeration",
  "superClasses": [
    "Enumeration"
  ],
  "subClasses": [],
  "properties": [],
  "enumerationMembers": [
    "PaymentComplete",
    "PaymentPastDue",
    "PaymentAutomaticallyApplied",
    "PaymentDue",
    "PaymentDeclined"
  ]
}
```
 
#### E.3) Fill property fields for classes and enumerations
For each property check the domainClasses, hence the classes and enumerations where they are used. Add the property to the properties field of that class/enumeration.
 Only properties for this particular class/enumeration are added, not all the properties from its superClasses.
Example data entry in the classes memory:
```JSON
{
    "name": "LodgingBusiness",
    "description": "A lodging business, such as a motel, hotel, or inn.",
    "type": "Class",
    "superClasses": [
      "LocalBusiness"
    ],
    "subClasses": [
      "BedAndBreakfast",
      "Motel",
      "Hotel",
      "Hostel",
      "Resort",
      "Campground"
    ],
    "properties": [
      "audience",
      "checkinTime",
      "petsAllowed",
      "availableLanguage",
      "amenityFeature",
      "starRating",
      "checkoutTime"
    ]
}
``` 
 
### F.) In-memory Output Data creation
This process step includes the rearrangement and materialization of the data in memory to create the output data according to the wished output files. At this stage the created data should match the target data model.

#### F.1) Create non-materialized Output Data

For the files **sdo_classes.json**, **sdo_properties.json**, **sdo_dataTypes.json**, **sdo_enumerations.json**, **sdo_enumerationMembers.json**:

At this point the in-memory data already matches the wished data model for the non-materialized output data. However the algorithm provides functions to translate the in-memory data into the output memory, providing the option to rename/rearrange the output if wished.

#### F.2) Create materialized Output Data

For the file **sdo_classesMaterialized.json**:

1. Add classes, enumerations and dataTypes to a new output memory.
2. Execute inheritance of properties for all classes and enumerations. For each entry  add all properties from the superclasses and recursively their superclasses.
3. Materialize properties for all classes and enumerations. For all properties substitute the property id with the corresponding object representation from the property memory.
4. Materialize enumerationMembers for all enumerations. For all enumerationMembers substitute the enumerationMember id with the corresponding object representation from the enumerationMember memory.

### G.) Export Output Data 
The output data created in the previous step is stored in the **data_output** directory of this project. Additional files that contain information about the conversion process are created:

- Log.txt - Contains meta data about the conversion.
- ErrorLog.txt - Contains errors during the conversion and their source.