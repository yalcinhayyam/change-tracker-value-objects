import 'reflect-metadata';

function classDecorator() {
    return function <T extends new (...args: any[]) => {}>(constructor: T) {
                const metadata = Reflect.getMetadataKeys(constructor);
    console.log(metadata)
        return class extends constructor {
            foo() {
                console.log("foo called");
            }

            logMetadata() {
                // Access and log values from metadata
                const metadata = Reflect.getMetadataKeys(this);
                console.log(metadata);
                metadata.forEach(key => {
                    const value = Reflect.getMetadata(key, this, key);
                    console.log(`Metadata for ${key}: ${value}`);
                });
            }
        };
    };
}

function propertyDecorator() {
    return function (target: any, key: string) {
        // Use the same key as in the logMetadata method
        Reflect.defineMetadata(key, 'myValue', target, key);
    };
}

// Applying decorators to a class
@classDecorator()
class MyClass {
    @propertyDecorator()
    public myProperty: string = 'initial value';
}

const data = new MyClass();
data.logMetadata(); // Log metadata after the object is created and properties are set
data.foo();
data.myProperty = "qdwq";
data.logMetadata(); // Log metadata after setting the property


interface IAuthor {
    readonly id: String;
    readonly name: StringValueObject<3, 10>;
    readonly books: Readonly<IBook>[];
}
interface IBook {
    title: string;
}

class Author implements IAuthor {
    protected constructor(
        public readonly id: String,
        public name: AuthorName,
        public readonly books: BookArrayChangeTracker | IBook[]
    ) { }

    addBook(title: string) {
        this.books.push({ title });

    }
    static create(name: AuthorName): IAuthor {
        const author = new Author("AUTHOR_ID", name, []);

        return author
    }
}

abstract class StringValueObject
    <
        TMinLength extends number = 0,
        TMaxLength extends number = 50
    >
    extends String {
    constructor(public readonly value: string, protected readonly min: TMinLength, protected readonly max: TMaxLength) {
        if (value.length > max || value.length < min) {
            throw new Error("Argument length error");
        }
        super(value);
    }
}
/* function CreateStringValueObject(min?: number, max?: number) {
    if (!min || !max) {
        return class extends StringValueObject {
            constructor(value: string) {
                super(value, 0, 50)
            }
        }
    }

    return class extends StringValueObject<typeof min, typeof max> {
        constructor(value: string) {
            super(value, min!, max!)
        }
    }
}
*/

// class AuthorName extends CreateStringValueObject(4, 10) { }
class AuthorName extends StringValueObject<3, 10> {
    constructor(value: string) {
        super(value, 3, 10)
    }
}

//const author = Author.create(new AuthorName("dwdwqdw"));
//console.log(author)


class BookArrayChangeTracker extends Array<IBook> implements ReadonlyArray<IBook>{
    constructor(...items: IBook[]) {
        super(...items)
    }
    push(...items: IBook[]): number {
        new ItemAdded<IBook[]>("book", items)
        return super.push(...items)
    }
}

class ArrayChangeTracker<T> extends Array<T> implements ReadonlyArray<T>{
    constructor(private readonly key: string, ...items: T[]) {
        super(...items)
    }
    push(...items: T[]): number {
        new ItemAdded<T[]>(this.key, items)
        return super.push(...items)
    }
}



class ArrayChangeTrackerV2<T> extends Array<T> implements ReadonlyArray<T>{
    constructor(private readonly notifications: AbstractNotification<T[]>[], private readonly model: string, ...items: T[]) {
        super(...items)
    }
    push(...items: T[]): number {
        this.notifications.push(new ItemAdded<T[]>(this.model, items))
        return super.push(...items)
    }
}
class ObjectChangeTracker<T> {

}

abstract class PrimitiveChangeTracker<T> {
    constructor(private readonly notifications: AbstractNotification<T>[],
        private readonly model: string,
        value: T) { }
}


abstract class AbstractNotification<T> {
    constructor(
        readonly model: string,
        readonly operation: string,
        readonly value: T,

    ) { }

}

class ItemAdded<T> extends AbstractNotification<T>{
    constructor(
        model: string,
        value: T
    ) {
        super(model, "createMany", value)
    }

}





