import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Device } from '@capacitor/device';;
import { CapacitorSQLite, capSQLiteChanges, capSQLiteValues, JsonSQLite } from '@capacitor-community/sqlite';
import { HttpClient } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { Cita } from '../modelo/cita';

@Injectable({
  providedIn: 'root',
})
export class SqlServiceService {

  public dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public isWeb: boolean = false;
  public nombreDb: string = 'data.db';
  public contador = 0;

  constructor(
    private readonly http: HttpClient
  ) {

  }

  public async inicializarBaseDatos() {

    console.log('Iniciando la base de datos');

    const info = await Device.getInfo();
    const sqlite = CapacitorSQLite as any;

    if (info.platform == 'web') {
      this.isWeb = true;

      // *  Nos aseguramos que el jeep-sqlite esté definido
      await customElements.whenDefined('jeep-sqlite');
      console.log('jeep-sqlite listo');

      await sqlite.initWebStore();
      console.log('webStore inicializado');
    }

    this.crearConexion();

  }

  async crearConexion() {

    const dbSetUp = await Preferences.get({ key: 'first_setup_key' });

    if (!dbSetUp.value) {
      this.descargarBaseDatos();
    } else {
      await CapacitorSQLite.createConnection({ database: this.nombreDb });
      await CapacitorSQLite.open({ database: this.nombreDb });
      this.dbReady.next(true);

      this.crearTablacitas();

    }

  }

  async crearTablacitas() {

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS citas (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        frase TEXT NOT NULL,
        autor TEXT NOT NULL
      );`;

    await CapacitorSQLite.execute({
      database: this.nombreDb,
      statements: createTableQuery
    });

  }

  descargarBaseDatos() {
    this.http.get<JsonSQLite>('/assets/db/db.json').subscribe(
      async (jsonExport) => {

        const jsonstring = JSON.stringify(jsonExport);
        const isValid = await CapacitorSQLite.isJsonValid({ jsonstring });
        if (isValid.result) {

          await CapacitorSQLite.importFromJson({ jsonstring });
          await CapacitorSQLite.createConnection({ database: this.nombreDb });
          await CapacitorSQLite.open({ database: this.nombreDb });

          await Preferences.set({ key: 'first_setup_key', value: '1' });
          await Preferences.set({ key: 'dbName', value: this.nombreDb });

          this.dbReady.next(true);

        }

      })
  }

  // ! ------------- FUNCIÓN PARA INSERTAR EN LA BASE DE DATOS ------------- ! /
  async insertar(cita: Cita) {

    console.log('La bdd se llama', this.nombreDb);

    // * Verifica que los campos necesarios existan
    if (!cita.frase || !cita.autor) {
      return Promise.reject('Frase y autor son requeridos');
    }

    const query = 'INSERT INTO citas (frase, autor) VALUES (?, ?)';
    const valores = [cita.frase, cita.autor];

    try {

      const changes: capSQLiteChanges = await CapacitorSQLite.executeSet({
        database: this.nombreDb,
        set: [{ statement: query, values: valores }]
      });

      if (this.isWeb) {
        await CapacitorSQLite.saveToStore({ database: this.nombreDb });
      }
      await this.findAllCitas();
      return changes;

    } catch (error) {
      console.error('Error al insertar citas: ', error);
      return Promise.reject(error);
    }

  }

  // ! --------------------- FUNCIÓN PARA VER LAS CITAS -------------------- !/
  async findAllCitas() {
    let query = 'SELECT * FROM citas;';

    try {

      const result: capSQLiteValues = await CapacitorSQLite.query({
        database: this.nombreDb,
        statement: query
      });

      if (result.values) {
        return result.values;
      } else {
        return [];
      }

    } catch (error) {
      console.error('Error al obtener las citas:', error);
      return Promise.reject(error);
    }

  }

  // ! ----------------- FUNCIÖN PARA ACTUALIZAR LAS CITAS ----------------- !/
  async actualizar(cita: Cita): Promise<capSQLiteChanges> {
    if (!cita.id || !cita.frase || !cita.autor) {
      return Promise.reject('ID, frase y autor son requeridos');
    }

    const query = 'UPDATE citas SET frase = ?, autor = ? WHERE id = ?';
    const valores = [cita.frase, cita.autor, cita.id];

    try {
      const changes: capSQLiteChanges = await CapacitorSQLite.executeSet({
        database: this.nombreDb,
        set: [{ statement: query, values: valores }],
      });

      if (this.isWeb) {
        await CapacitorSQLite.saveToStore({ database: this.nombreDb });
      }

      return changes;

    } catch (error) {
      console.error('Error al actualizar cita:', error);
      return Promise.reject(error);
    }
  }

  // ! ------------------- FUNCIÓN PARA ELIMINAR UNA CITA ------------------ !/
  async eliminar(id: number): Promise<capSQLiteChanges> {
    if (!id) {
      return Promise.reject('ID es requerido para eliminar una cita');
    }

    const query = 'DELETE FROM citas WHERE id = ?';
    const valores = [id];

    try {
      const changes: capSQLiteChanges = await CapacitorSQLite.executeSet({
        database: this.nombreDb,
        set: [{ statement: query, values: valores }],
      });

      if (this.isWeb) {
        await CapacitorSQLite.saveToStore({ database: this.nombreDb });
      }

      return changes;

    } catch (error) {
      console.error('Error al eliminar cita:', error);
      return Promise.reject(error);
    }
  }
}
