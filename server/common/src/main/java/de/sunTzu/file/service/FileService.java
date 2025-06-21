package de.sunTzu.file.service;

import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileService {

    private final String pathPrefix = "/audio/";

    public void deleteFile(String fileName) {
        Path path = Paths.get(pathPrefix + fileName);

        try {
            Files.delete(path);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void createFile(String fileName, byte[] data) {
        File file = new File(pathPrefix + fileName);

        try(FileOutputStream outputStream = new FileOutputStream(file)) {
            outputStream.write(data);
        } catch (IOException e) {
            System.out.println("Creating file failed possible due to wrong pathPrefix");
            e.printStackTrace();
        }
    }
}
